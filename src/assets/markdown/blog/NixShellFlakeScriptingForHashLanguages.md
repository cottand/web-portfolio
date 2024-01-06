# Scripting via the Nix shell with hash languages

_22/11/2023 - #nix #script #kotlin #go #shebang #nix-flake_
<br></br>

## The problem

If you are like my and _cannot stand_ scripting in loosely
typed languages, then you probably have heard of [Yaegi for Go](https://github.com/traefik/yaegi),
or have been following the developments of [Rust's `cargo-script`](https://github.com/rust-lang/rfcs/pull/3502)
and [Kotlin's .kts scripts](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md).

These are all great -- and god do I love being able to script
in a language that does not read like ancient babylonian, and is not Python (read further
down as to why).

```kotlin
!# /usr/bin/env kotlin
# hiddenfile: demo.main.kts #

println("Hello world, I am a Kotlin script!")
```

The above actually works!

But actually using these to automate things quickly becomes tricky in real
workflows - some, or all of these, require environments to run them.  If you
are shipping your apps as containers, you are not going to be installing JDK-17
on your production boxes just so you can make a Kotlin script.

Nix to the rescue: I was keen to write scripts in Go or Kotlin, and so I tried
out Nix's shebang (#!) feature:


TODO - make sure the web parsing works for shebang scripts!
TODO - airplane script :c
```kotlin
#! /usr/bin/env nix-shell
#! nix-shell -p kotlin -i kotlin
# hiddenfile: broken.main.kts #

println("Hello world, I am Kotlin script!")
```

But when I try to run it, I get errors:

```
 test_bad_main.kts:2:1: error: expecting an element
 #! nix-shell -p kotlin -i kotlin
 ^
 test_bad_main.kts:2:4: error: unresolved reference: nix
 #! nix-shell -p kotlin -i kotlin
    ^
 ```

This I did not expect - having Nix set up Kotlin worked, but then the Kotlin compiler couldn't
handle the script. It is complaining about the shebangs (`#!`) not being valid Kotlin (which, in
all fairness, they are not).
It turns out the Kotlin compiler only expects a single shebang line, but using
the `nix-shell` magic requires several.

The sad part is this may happen to every language that has slashes (`//`) rather than hashes (`#`) for comments.
So I could make this work for Go via Yaegi either.

## Requirements 

In a quest to attain Nix and hash-languages goodness, I am trying to make Go,
Kotlin (and potentially any C-like-syntax language) work with Nix shells.

Ideally, our solution should
- be self-contained - ie, it should not need environment bootstrapping (other than Nix)
- be reproducible (we want to be able to pin the version of the compiler
for our scripts)
- be easy (we can't be writing another script every time we want to write a script!)
- be portable

## The solution

I know I set myself a restriction of not needing any bootstrapping beyond Nix,
but hear me out: if only we could wrap our script in some other executable,
pre-process the shebangs, and then run it.
But how can we do this without another adjacent script?

The answer is Nix flakes. If you use Nix but are not using flakes yet, go use them
and then come back, because they are great. Specifically, Nix 1.19 comes with
support for shebangs in `nix shell` (the new flake variant of `nix-shell`).

My answer was to make a _tiny_ flake which wrapped the compiler,
so that it could remove those pesky '`#!`' via `sed` before I could run
my code.

Here is how the end result looks (for Go):
```nix
# hiddenfile: flake.nix #
{
    inputs.nixpkgs.url = "github:nixos/nixpkgs";
    outputs = { nixpkgs, ... }: let
        system = "x86_64-linux";
        pkgs = import nixpkgs { inherit system; };
    in {
        packages."${system}".go-yaegi = pkgs.stdenv.mkDerivation rec {
          inherit version;
          name = "go-yaegi";
          src = ./.;
          nativeBuildInputs = [ pkgs.makeBinaryWrapper ];
          buildInputs = [ pkgs.yaegi ];
          installPhase = ''
            mkdir -p $out/bin
            cat exec.sh | sed 's/EXEC/yaegi/g' | tee $out/bin/${name}
            echo "#! /usr/bin/env sh" >> $out/bin/${name}
            echo "cat $1 | sed 's/#!/\/\//g' | yaegi" >> $out/bin/${name}
            chmod +x $out/bin/${name}
            wrapProgram $out/bin/${name}  --prefix PATH : ${pkgs.lib.makeBinPath [ pkgs.yaegi ]}
          '';
        };
    };
}
```

Flake boilerplate aside, all this does is calling 

```
sed 's/#!/\/\//g' | yaegi
```
on our script! And yes, I do see the irony of using Bash so
that we can script on something else than Bash.

Let's try it out:

```go
#! /usr/bin/env nix
#! nix shell {YOUR_FLAKE_HERE}#go-yaegi --quiet --command go-yaegi
# hiddenfile: replaced.go #

package main
func main() { println("Hello from Go") }
```

And it works! pulling some dependencies down, running this just prints
`Hello from Go`. Lovely.

This is small enough that you can shamelessly steal it and
copy-paste it into your own flake (and you are welcome to).
But in case you do not want to bother, you can use mine:
[github:cottand/hash2slash](https://github.com/cottand/hash2slash).

So far I have added support for Go (interpreted via Yaegi, or compiled
via `go run`) and Kotlin (compiled via `kotlin`).

You can use it like so:

```go
#! /usr/bin/env nix
#! nix shell github:cottand/hash2slash#go-run --quiet --command hash2slash-go-run
# hiddenfile: withHash2slash.go #

package main
func main() { println("Hello from Go") }
```

Or, for Kotlin:

```kotlin
#! /usr/bin/env nix
#! nix shell /home/cottand/dev/cottand/hash2slash#kotlin --quiet --command hash2slash-kotlin
# hiddenfile: withHash2slash.main.kts #

fun greet(greeting: String) = "Hello, $greeting!"

println(greet("I am a script"))
```

### Thoughts on the trade-offs

#### Pinning

You will have realised you are one-off using Nix flakes without actually
using them as inputs in your own flake.
This means no lock file, so Nix will resolve
the revision of Nixpkgs every time you run the script.

This is terrible not just for speed (a moving target will be cached less and
garbage collected more) but for future-proofing and reliability. A new, future,
version of Nixpkgs could break an otherwise working script.
Because of this, you should pin your Nixpkgs to a specific revision, like so:

```go
#! /usr/bin/env nix
#! nix shell github:cottand/hash2slash/v0.0.1#go-run --quiet --command hash2slash-go-run
#! nix shell --override-input nixpkgs github:NixOS/nixpkgs/2691dec
# hiddenfile: pinned.go #

package main
func main() { println("Hello from Go") }
```

This will ensure that your script is run with the exact same inputs every time,
and those are explicitly declared.
#### Speed

Your scripts will be slow to start - the first time, very slow.
Keep in mind that the price for not installing OpenJDK19 in the
machine in advance of running Kotlin scripts is that you will be installing
it when you start the script. For Go the impact will be a lot
smaller but still noticeable.

The good news is that the second time you run your scripts
it should be instant, as long as Nix has
not [garbage-collected](https://nixos.org/manual/nix/unstable/package-management/garbage-collection.html)
the derivation of our wrapped compiler.

I still think the approach is worthwhile. Scripts tend to be one-offs,
or are run repeatedly enough that you won't be downloading
the script's environment every time. But feel free to reach out
to me with your thoughts :)


## Appendix: why I would rather not script in Bash

**The following is just my opinion.**

Although they are more common the closer you work to
infrastructure, scripts (bash or otherwise) have a
place in all sorts of workflows in order to automate tasks.
This ranges from your laptop's git hook to CI to infra provisioning.
If your scripts break in production, you will have an incident,
just like you would for your application code.


As such, I believe script code should be treated like we treat the rest of our
code - we should peer-review it, test it, source-control it, etc.
And, of course, we should write it in a language that 
- we can be (more) confident to write bug-free code in
- us, our peers, and our hires can review easily
- we are comfortable to maintain in the future -- you write code once,
but you read and debug it countless times!

If the language that your team can achieve all of this is in is
actually Bash, be my guest! Go break a leg.

But chances are it is not (or you would also write your application
code in it, right?). Most likely, the best language for this is
one your team is already proficient in: the language
you write application code in.

For me, historically
that has been Java, Kotlin, or Go. For you, it might be Python or Haskell!
Some languages definitely lend themselves more to scripting, but
that's a discussion for another blog.

The point is that I do think it is worthwhile to make your
team's language of choice work for your scripts - if not
for your comfort, for the sake of making sure prod
doesn't catch fire!


## References
- [Nix manual for `nix-shell`](https://nixos.org/manual/nix/stable/command-ref/nix-shell.html)
- [Nix manual for `nix shell` (unstable)](https://nixos.org/manual/nix/unstable/command-ref/new-cli/nix3-shell)
- [Nix manual on garbage collection](https://nixos.org/manual/nix/unstable/package-management/garbage-collection.html)
