_20/01/2024 - #nix #docker #oci #arm #multi-arch #multi-platform_
<br></br>

## The Problem

If you have been using Nix for a bit, you have probably read that you can [use it to make
Docker images](https://nix.dev/tutorials/nixos/building-and-running-docker-images.html) _without_ Docker itself.
I recently managed to make a [multi-architecture image](https://docs.docker.com/build/building/multi-platform) (for ARM and x86) on GitHub Actions CI, but could
not find any help online. Hopefully this guide is of use to you!

> This post assumes you know the basics of Nix flakes and have managed to successfully build a container image
> already. If this is not you, I recommend [ZeroToNix](https://zero-to-nix.com/) to learn Nix,
> and [nix.dev](https://nix.dev/tutorials/nixos/building-and-running-docker-images.html) for more examples.

You will need a flake that already does `dockerTools.buildImage`. I will take the example below (taken from this website!).
I have omitted most of the build process for brevity. If you would like to see the full example,
you can [check out the repo](https://github.com/Cottand/web-portfolio/blob/master/flake.nix).

```nix
# hiddenfile: flake.nix #
{
  inputs = { /* ... */ };
  outputs = { self, nixpkgs, flake-utils, ... }:
    (utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in rec {
        packages.containerImage = pkgs.dockerTools.buildImage {
          name = "nico.dcotta.com";
          created = "now";
          tag = "nix";
          copyToRoot = pkgs.buildEnv { /* ... */ };
          config = {
            Cmd = [ "/bin/serve" ];
            ExposedPorts."80/tcp" = { };
          };
        };
      }));
}
```

The above `containerImage` package will build a TAR, labeled `nico.dcotta.com:nix` by default.
To put this in CI, let's say we start with a plain, simple Actions workflow that builds an image and pushes it to
your [ghcr.io](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) registry.

We can see the package with `nix flake show .`
```
$ nix flake show .
git+file:///home/.../dev/cottand/web-portfolio
└───packages
    ├───aarch64-darwin
    │   ├───containerImage: package 'docker-image-nico.dcotta.com.tar.gz'
    │   └───...
    ├───aarch64-linux
    │   ├───containerImage: package 'docker-image-nico.dcotta.com.tar.gz'
    │   └───...
    ├───x86_64-darwin
    │   ├───containerImage: package 'docker-image-nico.dcotta.com.tar.gz'
    │   └───...
    └───x86_64-linux
        ├───containerImage: package 'docker-image-nico.dcotta.com.tar.gz'
        └───...
```

For now, let's simply `nix build` our image, tag it, and push it with docker.

```yaml
# hiddenfile: .github/workflows/main.yml #
name: Build and Deploy
on: {push: {branches: [ "master" ]}}
env:
  # Use docker.io for Docker Hub if empty
  REGISTRY: ghcr.io
  REGISTRY_IMAGE: "ghcr.io/cottand/web-portfolio"
  DEFAULT_TAG: nico.dcotta.com:nix # Tag set by Nix

jobs:
  publish-nix-container:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2.2.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: cachix/install-nix-action@v22
        with:
          github_access_token: ${{ secrets.GITHUB_TOKEN }}

      - uses: DeterminateSystems/magic-nix-cache-action@main
      - run: nix build .#containerImage # 1
      - name: Tag and push image
        run: |
          git_sha=$(git rev-parse --short "$GITHUB_SHA")
          label=$git_sha-${{ matrix.system}}
          docker load < result # 2
          docker tag ${{ env.DEFAULT_TAG }} ${{ env.REGISTRY_IMAGE }}:$label # 3
          docker tag ${{ env.REGISTRY_IMAGE }}:latest ${{ env.REGISTRY_IMAGE }}:$git_sha
          docker push ${{ env.REGISTRY_IMAGE }}:latest  # 4
          docker push ${{ env.REGISTRY_IMAGE }}:$label
```

The above does the following:
- (#1): Nix build `containerImage`, which will result in a `result` symlink that contains our tar.
- (#2): Load said tar
- (#3): Tag it with `latest` and the git SHA of the current commit (this is my personal preference)
- (#4): Push the new image!

If you are wondering:
- _"Wait, why would I use Docker to tag my images? The whole point of using Nix
  is to remove my dependency on Docker!"_ -  You may actually have a point. But I found that, in practice
  using Docker as a fancy 'manifest making' tool (rather than for building your images) means that you
  only need to use it in CI. You are still removing the dependency on Docker for your local
  development.
- _"Why are we bothering to use images at all again? Isn't Nix reproducible by itself?"_ - Yes, it is,
  but if you have tried it, deploying Nix packages outside of NixOS is a pain. I want to use
  an orchestration platform (Nomad, K8s...) so I must to use OCI/Docker images.


What we have so far, in theory, is the well-documented, easy stuff you can find examples for online already. The tricky
part comes when you have to run your image on ARM as well as x86 hosts (which is the case of my [homelab](https://github.com/Cottand/selfhosted)).

Nix is capable of building these images, but it is not any good at crafting the manifest necessary
to tell a registry that we have several architectures. But Docker itself can do this!

## Making ARM images on GitHub Actions

Before we make fancy multi-arch images, we have to build our ARM images with Nix in the first place.

There is more than one way of doing this - the fastest is to use a GitHub ARM runner (which
you will have to host or pay for). To keep this simple and free, I am going to emulate ARM via QEMU.

```yaml
# hiddenfile: .github/workflows/main.yml #
  publish-nix-container:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:  # <- new: #0
        system:
          - aarch64-linux
          - x86_64-linux
    steps:
      - uses: actions/checkout@v3
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2.2.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: cachix/install-nix-action@v22 
        with:
          github_access_token: ${{ secrets.GITHUB_TOKEN }}
          extra_nix_config: |   
            extra-platforms = ${{ matrix.system }}   # <- new: #1
      - uses: cachix/install-nix-action@v22
        with: { github_access_token: ${{ secrets.GITHUB_TOKEN }} }
      - uses: DeterminateSystems/magic-nix-cache-action@main
      - uses: docker/setup-qemu-action@v1  # <- new: #2
      - run: nix build .#packages.${{ matrix.system }}.containerImage # <- new: #3
      - name: Tag and push image
        run: |
          git_sha=$(git rev-parse --short "$GITHUB_SHA")
          label=$git_sha-${{ matrix.system}}
          docker load < result 
          # etc...
```
The new lines above do the following:
- (#0): Make our job use a [build matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs):
Not as complicated as it sounds - we are basically running our job one extra time for every value in `matrix.system`
- (#1): Tell our new Nix installation that the current host can build for `matrix.system` (ie, `aarch64-linux` or `x86_64-linux`)
- (#2): Install QEMU, so we have emulation
- (#3): Build `packages.${matrix.system}.containerImage`. By also specifying the architecture
with our package, we are telling Nix to build for that specific platform.

And this should work! We now managed to build images for more architectures, but we are
not done yet - we still do not have a proper, single multi-arch image.

## Merging the manifests of all the images

The process for this is actually not specific to Nix at all. Docker have
[a pretty good example](https://docs.docker.com/build/ci/github-actions/multi-platform/).
The idea is to take the manifests of the images we've built, craft a new manifest, and push that to our registry.

For that we need two things: 
- to figure out the SHA digests
of our arch-specific images on the registry
- take the resolved digests and create a manifest
that references them, and push that to the registry

For the former, we can use `docker image inspect` to
fetch the manifest JSON and extract `RepoDigest`, which corresponds
to the digest in the repository.
Then we can write that to a GitHub actions
artifact for later retrieval:

```yaml
# hiddenfile: .github/workflows/main.yml #
- name: Tag and push image
  run: |
    git_sha=$(git rev-parse --short "$GITHUB_SHA")
    label=$git_sha-${{ matrix.system}}
    docker load < result # 2
    docker tag ${{ env.DEFAULT_TAG }} ${{ env.REGISTRY_IMAGE }}:$label
    docker push ${{ env.REGISTRY_IMAGE }}:$label
    # export digest
    docker pull ${{ env.REGISTRY_IMAGE }}:$label
    full=$(docker image inspect ${{ env.REGISTRY_IMAGE }}:$label --format "{{index .RepoDigests 0}}")
    digest=${full#${{ env.REGISTRY_IMAGE }}@}
    mkdir -p /tmp/digests
    touch "/tmp/digests/${digest#sha256:}"

- name: Upload digest
  uses: actions/upload-artifact@v3
  with:
    name: digests
    path: /tmp/digests/*
    if-no-files-found: error
    retention-days: 1
```

Once we have all our digests, we can use `docker buildx imagetools`
to create the new manifest. Let's do that in another 'merge' job:
```yaml
# hiddenfile: .github/workflows/main.yml #
merge-docker:
  runs-on: ubuntu-latest
  needs: [publish-nix-container]
  steps:
    # download the digests we made in the previous job
    - name: Download digests
      uses: actions/download-artifact@v3
      with: { name: digests, path: /tmp/digests }
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    - name: Log in to the Container registry
      uses: docker/login-action@65b78e6e13532edd9afa3aa52ac7964289d1a9c1
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Docker meta - 
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY_IMAGE }}
        tags: type=sha,event=push

    - name: Create manifest list and push
      working-directory: /tmp/digests
      run: |
        docker buildx imagetools create $(jq -cr '.tags | map("-t " + .) | join(" ")' <<< "$DOCKER_METADATA_OUTPUT_JSON") \
          $(printf '${{ env.REGISTRY_IMAGE }}@sha256:%s ' *)
```

Ta-da! That's all you need to create multi-arch (or multi-platform)
container images built with Nix rather than Docker.

You can find a working example in [this website's repo](https://github.com/Cottand/web-portfolio/blob/master/.github/workflows/main.yml).

Here is a final snippet so you can copy-paste easily:


```yaml
# hiddenfile: .github/workflows/main.yml #
name: Build and Deploy
on: { push: { branches: [ "master" ] } }

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  REGISTRY_IMAGE: "ghcr.io/cottand/web-portfolio"

jobs:
  publish-nix-container:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        system: [ aarch64-linux, x86_64-linux ]
    steps:
      - uses: actions/checkout@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2.2.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: cachix/install-nix-action@v22
        with:
          github_access_token: ${{ secrets.GITHUB_TOKEN }}
          extra_nix_config: |
            extra-platforms = ${{ matrix.system }}
      
      - uses: DeterminateSystems/magic-nix-cache-action@main

      - uses: docker/setup-qemu-action@v1

      - run: nix build .#packages.${{ matrix.system }}.containerImage

      - name: Tag and push image
        run: |
          git_sha=$(git rev-parse --short "$GITHUB_SHA")
          label=$git_sha-${{ matrix.system }}

          docker load < result
          docker tag nico.dcotta.com:nix ${{ env.REGISTRY_IMAGE }}:$label
          # docker tag ghcr.io/cottand/web-portfolio:latest ghcr.io/cottand/web-portfolio:$git_sha
          # docker push ghcr.io/cottand/web-portfolio:latest
          docker push ${{ env.REGISTRY_IMAGE }}:$label

          # export digest
          docker pull ${{ env.REGISTRY_IMAGE }}:$label
          full=$(docker image inspect ${{ env.REGISTRY_IMAGE }}:$label --format "{{index .RepoDigests 0}}")
          digest=${full#${{ env.REGISTRY_IMAGE }}@}
          mkdir -p /tmp/digests

          touch "/tmp/digests/${digest#sha256:}"

      - name: Upload digest
        uses: actions/upload-artifact@v3
        with:
          name: digests
          path: /tmp/digests/*
          if-no-files-found: error
          retention-days: 1

  merge-docker:
    runs-on: ubuntu-latest
    needs: [publish-nix-container]
    steps:
      - name: Download digests
        uses: actions/download-artifact@v3
        with:
          name: digests
          path: /tmp/digests
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Log in to the Container registry
        uses: docker/login-action@65b78e6e13532edd9afa3aa52ac7964289d1a9c1
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY_IMAGE }}
          tags: type=sha,event=push
      - name: Create manifest list and push
        working-directory: /tmp/digests
        run: |
          docker buildx imagetools create $(jq -cr '.tags | map("-t " + .) | join(" ")' <<< "$DOCKER_METADATA_OUTPUT_JSON") \
            $(printf '${{ env.REGISTRY_IMAGE }}@sha256:%s ' *)
      - name: Inspect image
        run: docker buildx imagetools inspect ${{ env.REGISTRY_IMAGE }}:${{ steps.meta.outputs.version }}          
      - name: Summary
        run: echo "# Published \`${{ steps.meta.outputs.tags }}\`" >> $GITHUB_STEP_SUMMARY
```


# References

- [nix.dev on Nix Docker Images](https://nix.dev/tutorials/nixos/building-and-running-docker-images.html)
- [GitHub - Working with the Container registry
  ](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub - Using a matrix for your jobs](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Docker - Multi-platform image with GitHub Actions](https://docs.docker.com/build/ci/github-actions/multi-platform/)