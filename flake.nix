{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-25.05";
    utils.url = "github:numtide/flake-utils";

    ile.url = "github:cottand/ile";
  };

  outputs = { self, nixpkgs, utils, ile, ... }:
    (utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        ile-pkgs = ile.packages.${system};
      in
      rec {
        packages.static = pkgs.buildNpmPackage {
          name = "cottand-web-portfolio";

          src = with pkgs.lib; cleanSourceWith {
            filter = path: _: !(builtins.elem (baseNameOf path) [ ".github" ".idea" "flake.nix" "flake.lock" "result" "Caddyfile" ]);
            src = (cleanSource ./.);
          };

          npmDepsHash = "sha256-Tz0xdJYiBXNlmS1PEM8zMONlRGRQG91Gcwlx0OaHOgg";
          npmPackFlags = [ "--ignore-scripts" ];

          configureScript = pkgs.writeScript "configure.sh" ''
            rm -rf ./public/assets/imported || 0
            dest="./public/assets/imported/bin/js_wasm"
            mkdir -p $dest
            # the WASM binary is too big for cloudflare pages
            # (and it's nice to save bandwidth anyway) so we compress it first
            # note we the must also decompress it directly in JS in ile_wasm.ts
            gzip -c ${ile-pkgs.ile-wasm}/bin/js_wasm/ile > $dest/ile.wasm.gzip


            rm -rf ./src/types/imported || 0
            mkdir -p ./src/types/imported
            cp ${ile-pkgs.ile-wasm-types} ./src/types/imported/ile-wasm.d.ts


            rm -rf ./src/assets/imported || 0
            mkdir -p ./src/assets/imported
            cp ${ile-pkgs.go-wasm-exec}/lib/wasm/wasm_exec.js ./src/assets/imported/
          '';

          installPhase = ''
            mkdir -p $out/srv
            cp -r dist/* $out/srv
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
