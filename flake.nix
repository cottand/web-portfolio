{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-23.11";
    utils.url = "github:numtide/flake-utils";

    ile.url = "github:cottand/ile";
  };

  outputs = { self, nixpkgs, utils, ile, ... }:
    (utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        go-wasm-exec = ile.packages.${system}.go-wasm-exec;
        ile-wasm = ile.packages.${system}.ile-wasm;
      in
      rec {
        packages.static = pkgs.buildNpmPackage {
          name = "cottand-web-portfolio";

          src = with pkgs.lib; cleanSourceWith {
            filter = path: _: !(builtins.elem (baseNameOf path) [ ".github" ".idea" "flake.nix" "flake.lock" "result" "Caddyfile" ]);
            src = (cleanSource ./.);
          };

          npmDepsHash = "sha256-KqMeNCUGvAkeDBeWomlRD5IJRncXiHrqTw3eoxO5H1Y=";
          npmPackFlags = [ "--ignore-scripts" ];

          configurePhase = ''
            mkdir -p ./public/assets/bin/js_wasm
            cp ${ile-wasm}/bin/js_wasm/ile ./public/assets/bin/js_wasm/ile.wasm

            mkdir -p ./src/assets/
            cp ${go-wasm-exec}/lib/wasm/wasm_exec.js ./src/assets
          '';
          installPhase = ''
            mkdir -p $out/srv
            cp -r build/* $out/srv
          '';
        };
        packages.default = packages.static;

        packages.serve = pkgs.stdenv.mkDerivation {
          name = "serve";
          buildInputs = [ pkgs.caddy packages.static ];
          nativeBuildInputs = [ pkgs.makeBinaryWrapper ];

          src = with pkgs.lib; cleanSourceWith {
            filter = path: _: (baseNameOf path) == "Caddyfile";
            src = (cleanSource ./.);
          };

          unpackPhase = ":";
          installPhase = ''
            mkdir -p $out/bin
            mkdir -p $out/etc
            echo $src
            cat $src/Caddyfile | sed "s|NIX_STORE_PATH|$out/srv|g" >> $out/etc/Caddyfile
            cp -r ${packages.static}/srv $out
            echo "#! /bin/env sh" >> $out/bin/serve
            echo "set -e" >> $out/bin/serve
            echo "caddy run --config $out/etc/Caddyfile" >> $out/bin/serve
            chmod +x $out/bin/serve
            wrapProgram $out/bin/serve  --prefix PATH : ${pkgs.lib.makeBinPath [ pkgs.caddy ]}
          '';
        };

        packages.containerImage = pkgs.dockerTools.buildImage {
          name = "nico.dcotta.com";
          created = "now";
          tag = "nix";
          copyToRoot = pkgs.buildEnv {
            name = "files";
            paths = [ packages.serve ];
          };
          config = {
            Cmd = [ "${packages.serve}/bin/serve" ];
            ExposedPorts."80/tcp" = { };
          };
        };
      }));
}
