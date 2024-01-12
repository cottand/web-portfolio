{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-23.11";
    utils.url = "github:numtide/flake-utils";

  };


  outputs = { self, nixpkgs, utils, ... }:
    (utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; }; in rec {

        packages.default = pkgs.buildNpmPackage {
          buildInputs = [ pkgs.caddy ];
          pname = "cottand-web-portfolio";
          version = "dev";

          src = with pkgs.lib; cleanSourceWith {
            filter = path: _: !(builtins.elem (baseNameOf path) [ ".github" ".idea" "flake.nix" "flake.lock" "result" ]);
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


        packages.containerImage = pkgs.dockerTools.buildImage {
          name = "nico.dcotta.eu";
          created = "now";
          tag = "nix";
          copyToRoot = pkgs.buildEnv {
            name = "files-srv";
            paths = [ packages.default ];
            pathsToLink = [ "/srv" "/etc/caddy" ];
          };
          config = {
            Cmd = [ "${pkgs.caddy}/bin/caddy" "run" "--config" "${packages.default}/Caddyfile" ];
            ExposedPorts."80/tcp" = { };
          };
        };
      }));
}
