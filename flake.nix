{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-23.11";
    utils.url = "github:numtide/flake-utils";

  };


  outputs = { self, nixpkgs, utils, ... }:
    (utils.lib.eachDefaultSystem (system:
      let
      pkgs = import nixpkgs { inherit system; };
      version = "0.0.1";
       in rec {

        packages.static = pkgs.buildNpmPackage {
          inherit version;
          pname = "cottand-web-portfolio";

          src = with pkgs.lib; cleanSourceWith {
            filter = path: _: !(builtins.elem (baseNameOf path) [ ".github" ".idea" "flake.nix" "flake.lock" "result"  ]);
            src = (cleanSource ./.);
          };

          npmDepsHash = "sha256-HRD/eThxVDOTe5bky4VEu9uDtci+SZoIM74YVr/00kI=";
          npmPackFlags = [ "--ignore-scripts" ];
          installPhase = ''
            mkdir -p $out/srv
            cp -r build/* $out/srv
            cp Caddyfile $out/
          '';
        };
	packages.default = packages.static;

        packages.serve = pkgs.stdenv.mkDerivation {
          pname = "serve";
          inherit version;
        buildInputs = [ pkgs.caddy packages.static ];
        nativeBuildInputs = [ pkgs.makeBinaryWrapper ];

          src = with pkgs.lib; cleanSourceWith {
            filter = path: _: (baseNameOf path) == "Caddyfile";
            src = (cleanSource ./.);
          };

          unpackPhase = ":";
          installPhase = ''
            mkdir $out
            mkdir $out/bin
            cp $src $out
            cp -r ${packages.static}/srv $out
            echo "#! /bin/env sh" >> $out/bin/serve
            echo "caddy run --config $out/Caddyfile" >> $out/bin/serve

            chmod +x $out/bin/serve

            wrapProgram $out/bin/serve  --prefix PATH : ${pkgs.lib.makeBinPath [ pkgs.caddy ]}
          '';
        };


        packages.containerImage = pkgs.dockerTools.buildImage {
          name = "nico.dcotta.eu";
          created = "now";
          tag = "nix";
          copyToRoot = pkgs.buildEnv {
            name = "files-srv";
            paths = [ packages.static ];
            pathsToLink = [ "/srv" "/etc/caddy" ];
          };
          config = {
            Cmd = [ "${pkgs.caddy}/bin/caddy" "run" "--config" "${packages.static}/Caddyfile" ];
            ExposedPorts."80/tcp" = { };
          };
        };
      }));
}
