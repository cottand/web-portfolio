{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-23.11";
    utils.url = "github:numtide/flake-utils";

  };

  outputs = { self, nixpkgs, utils, ... }:
    (utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      rec {
        packages.static = pkgs.buildNpmPackage {
          name = "cottand-web-portfolio";

          src = with pkgs.lib; cleanSourceWith {
            filter = path: _: !(builtins.elem (baseNameOf path) [ ".github" ".idea" "flake.nix" "flake.lock" "result" "Caddyfile" ]);
            src = (cleanSource ./.);
          };

          npmDepsHash = "sha256-VIwbN3xFLSBtLg8aE2bBwpsV8+Ld0zyDnXO6956aA7M=";
          npmPackFlags = [ "--ignore-scripts" ];
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
