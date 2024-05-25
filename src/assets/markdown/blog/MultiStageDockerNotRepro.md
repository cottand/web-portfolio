_03/02/2024 - #nix #docker #oci #reproducible_
<br></br>

I do not often write opinionated articles - I tend to stick to more technical "Hey look at this clever trick!" kind of post.
But this is an issue I have dealt with a bit now, and I would like
to change a pre-conception that [I was myself wrong about](https://nico.dcotta.com/blog/ReproducibleCacheableGradleDocker).
Most importantly, I am hoping to share what I have learnt since!

> **TL;DR:** No, building your app inside your Dockerfile does not make your Docker images reproducible as in _"if it worked once, it will always work"_

But why is this? Let me start with why I used to think this stuff worked fine.

The idea goes: if the enviornment I am building (compiling, pulling dependencies, etc) my appliecation on is always the same, then surely my application should also result in the same, right? It turns out this is false
for the following reasons.

## Your starting environment is more in flux than you think

When making a new Docker build, I would for example begin with:

```Dockerfikle
FROM ubuntu:focal

# build my cool app!
```

If I started off with `ubuntu:focal` ([Ubuntu 20.04](https://www.releases.ubuntu.com/focal/), which came out in 2020), then I expected I would always be building my app in top of the same 'base' of dependencies. Even if Ubuntu released version 22, I would have to expclicitly change my Ubuntu version in my Dockerfile. Deep down, both you and me know this is a lie: Ubuntu will keep receiving security updates long after the distro has come out:

<img src="/assets/blog/ubuntuFocal.png" caption="Dockerhub page for ubuntu:focal" class="centered border-radius" style="width: min(95%, 600px);"/>

An indeed it has. As we can see there at the time of writing, Ubuntu had received an update only a few days ago.

But even if I did know this, I thought _it didn't matter_. I thought bit-by-bit reproducibility of the build environment did not have benefits that warranted seeking it.

I now think otherwise (and who knows, I might be wrong now too!). Bit-by-bit reproducibility has very strong properties: 

### If `X` worked with this binary, I have a _guarantee_ `X` will work with a binary of the same hash.

When your deployment blobs are hashed, you can know which confidence what changed and what didn't. If _does_ break, you can be certain that whatever broke, it was not 'that' binary. 

### If I trusted a binary with this hash, I can trust another binary with the same hash.

A change in my life before I started caring about reproducibility was moving into a security-focused role (at Monzo Bank). When you are worrying about attackers and your builds are not reproducible, you have to make sure your entire build pipeline is air-tight. This is because there are so, so many steps where you could have gotten compromised.

But if your built binary is the same as an old binary you trusted, you simly don't care if your new binary was built in some sketchy black hat's basement: the same hash means no one tampered with the build.

It is actually fine to trust a public binary from the internet (something you would not usually do in prod), if you managed to compile the source and your binary yielded the same hash.

## Guaranteeing the same starting environment does not guarantee the same end-results

Even if you start from a base image's `sha256` digest (meaning you are immune to image updates) your build might yield different results if run twice. This is a problem -- and not just because you cannot benefit from the trust hashing gives you.

Many things in a build can produce non-determinism:
- depdendencies' downloads (looking at you, Maven repos)
- package manager updates (`apt upgrade`)

This makes you vulnerable to the scenario where you manage to get something working, you do not touch it, and it breaks on its own because some random package or dependency gets updated and makes it into your build pipeline. And I mean "vulnerable" in  not just from the security point of view, but from an operational one as well.

All these things that might break your build are _inputs_ to the build. I used to think as a build going from source code to compiled binary, but there is so much more to it. Inputs to your build include the compiler version you are using (and all its parameters, like optimizations), the libraries you are linking against, build metadata, and the environment your application runs in (ie, the runtime container) and _all the inputs of those things_.

## Fine, I should make my builds deterministic. But how?

First off, you need to make sure the following is happening in your builds:
- input ennumeration: make sure you keep track of everything your build uses
- sealing: make sure you build is not affected by things in ways did not intend


Can Docker do this? The answer is yes, kind of, but I do not recommend it. [This blog](https://medium.com/nttlabs/bit-for-bit-reproducible-builds-with-dockerfile-7cc2b9faed9f) post has some hacks that really do help with this, and uses the right approaches (like locking your dependencies with hashing).
But the reality is that Docker was just not made to achieve theproducible builds. It was made to ship your application along with everything it needed to run (dynamic libraries, etc). In that it does succeed! 

My advice is that you should use a tool engineered to achieve reproducibility.
You can then use this tool to build, and can make a container out of the result if you wish.


The best such tool I have tried is [Nix](https://nixos.org/). There are more, such as [Guix](https://guix.gnu.org/blog/2020/reproducible-computations-with-guix/). Some of the package managers from distros you are already used to also strive for reprodicibility, such as [Debian](https://tests.reproducible-builds.org/debian/reproducible.html).

I admit to being a big fan of Nix, but the point of this post is not to evangelise Nix specifically, but to convince you that reprodiceble builds are good for you and well worth the trouble. So embrace whatever tool you prefer! And if it is a tool specifically made to achieve reproducibility (unlike Docker) then you will save yourself some headaches.

## Read more

You should [this post](https://mitchellh.com/writing/nix-with-dockerfiles) by Mitchell Hashimoto (Hashicorp co-founder)
on building Docker images with Nix packages.

If you want to take it further, David Wagner has [another good one](https://thewagner.net/blog/2021/02/25/building-container-images-with-nix/)
on reproducibly making containers without Docker at all!

# References

- [moby/buikdlit#4057 - Rewrite timestamps in layers for reproducible builds](https://github.com/moby/buildkit/pull/4057)
- [Securing the software supply chain _by VMWare_](https://blogs.vmware.com/opensource/2021/08/05/first-steps-for-securing-the-software-supply-chain-part-2/)
- [Bit-for-bit reproducible builds with Dockerfile _by Akihiro Suda_](https://medium.com/nttlabs/bit-for-bit-reproducible-builds-with-dockerfile-7cc2b9faed9f)