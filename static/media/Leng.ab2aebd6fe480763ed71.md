Leng is an ad-blocking proxy DNS server (like [Blocky](https://github.com/0xERR0R/blocky)) with support for defining
custom records with
proper zonefile syntax (like [CoreDNS](https://coredns.io/)). It is written in Go and I forked it
from [grimd](https://github.com/looterz/grimd).

It is similar to PiHole in function, but it is designed to be stateless and more lightweight as well as easier to use
(see a comparison with it and other DNS proxies [here](https://cottand.github.io/leng/AlternativesComparison.html)).

<img
src="/assets/project/leng.png"
class="centered border-radius"
caption="Grafana monitoring for a Leng cluster running in my homelab"
/>

It is packaged with Nix (which makes it easy to deploy to NixOS servers) and starts up quickly (which makes
it suitable for templated deployments with orchestration frameworks like Nomad or K8s).

Here is a working example of a Leng configuration file:

```toml
# address to bind to for the DNS server
bind = "0.0.0.0:53"

# address to bind to for the API server
api = "127.0.0.1:8080"

# manual custom dns entries - comments for reference
customdnsrecords = [
    "home.mywebsite.tld      IN A       10.0.0.1",
]

[Metrics]
    enabled = true
```
