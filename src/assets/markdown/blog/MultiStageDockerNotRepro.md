# Dockerfile builds are not (usually) reproducible

_03/02/2024 - #nix #docker #oci #reproducible_
<br></br>

I do not often write opinionated articles - I tend to stick to more technical "Hey look at this clever trick!" kind of post.
But this is an issue I have dealt with a bit now, and I would like
to change a pre-conception that [I was myself wrong about](https://nico.dcotta.eu/blog/ReproducibleCacheableGradleDocker).
Most importantly, I am hoping to share what I have learnt since!

> **TL;DR:** No, building your app inside your Dockerfile does not make your Docker images reproducible as in _"if it worked once, it will always work"_

But why is this? Let me start with why I used to think this stuff worked fine.

The idea goes: if the enviornment I am building (compiling, pulling dependencies, etc) my appliecation on is always the same, then surely my application should also result in the same, right? It turns out this is false
for the following reasons:

## Your starting environment is more in flux than you think

When making a new Docker build, I would for example begin with:

```Dockerfikle
FROM ubuntu:focal

# build my cool app!
```

If I started off with `ubuntu:focal` ([Ubuntu 20.04](https://www.releases.ubuntu.com/focal/), which came out in 2020), then I expected I would always be building my app in top of the same 'base' of dependencies. Even if Ubuntu released version 22, I would have to expclicitly change my Ubuntu version in my Dockerfile. Deep down, both you and me know this is a lie: Ubuntu will keep receiving security updates long after the distro has come out:

An indeed it has. As we can see there at the time of writing, Ubuntu had received an update only a few days ago.

But even if I did know this, I thought _it didn't matter_. I thought bit-by-bit reproducibility of the build environment did not have benefits that warranted seeking it.

I now think otherwise (and who know, I might be wrong now too!). Bit-by-bit reproducibility has extremely strong properties: 

### If `X` worked with this binary, I have a _guarantee_ `X`` will work with a binary of the same hash.

 This gives you an extremly high level of confidence when performing deployments, because you are removing your application from the 'set' of things that can go wrong when deploying.
 
 If you have the exact same binary and something _does_ break, you can be certain that whatever broke, it was not the binary.

### If I trusted a binary with this hash, I can trust another binary with the same hash.

 One of the changes in my life since I changed my mind has been moving into a security-focused role (at Monzo Bank). When you are worrying about attackers and your builds are not reproducible, you have to make sure your entire build pipeline is air-tight. This is because there are so, so many steps where you could have gotten compromised.
 
 But if your built binary is the same as an old binary you trusted, you simly don't care if your new binary was built in some sketchy black hat's basement: the same hash means no one tampered with the build.




### Guaranteeing the same starting environment does not guarantee the same end-results


# References

- [moby/buikdlit#4057 - Rewrite timestamps in layers for reproducible builds](https://github.com/moby/buildkit/pull/4057)
- [Securing the software supply chain _by VMWare_](https://blogs.vmware.com/opensource/2021/08/05/first-steps-for-securing-the-software-supply-chain-part-2/)
- [Bit-for-bit reproducible builds with Dockerfile _by Akihiro Suda_](https://medium.com/nttlabs/bit-for-bit-reproducible-builds-with-dockerfile-7cc2b9faed9f)


- [nix.dev on Nix Docker Images](https://nix.dev/tutorials/nixos/building-and-running-docker-images.html)
- [GitHub - Working with the Container registry
  ](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub - Using a matrix for your jobs](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Docker - Multi-platform image with GitHub Actions](https://docs.docker.com/build/ci/github-actions/multi-platform/)