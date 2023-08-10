# Running both ad-blocking and poor man's DNS service-discovery for self-hosted Nomad
_10/08/2023 - #noamd #selfhosted #dns #adblock_
<br></br>

## Background
So, you would like to run a Nomad cluster but would rather not bother with a [Consul](https://github.com/hashicorp/consul) deployment?
Fair enough! You run a self-hosted setup on your in-law's old Mac Mini and some Raspberry Pis - deploying _another_
raft stateful application is a massive pain.
And why would you, after all? Nomad nowadays
has [its own service-discovery](https://www.hashicorp.com/blog/nomad-service-discovery),
and you can integrate that into the thingies that care,
like [Traefik](https://doc.traefik.io/traefik/providers/nomad/) (for your ingress proxy) or
[Prometheus](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#nomad_sd_config) (for scraping
metrics). Nomad even health checks your services and removes them from their downstream when
they become unhealthy. It can also store secrets as Nomad variables.

So what does Nomad do that Consul can't now? A few things, it turns out. I won't list them,
but they include stuff like a service mesh, its K/V storage, and **service discovery through DNS**.

This last item is what I would like to tackle in this post! 

## The problem
I would like to achieve service discovery with **poor man's
DNS for Nomad**, without Consul.
Additionally, because this DNS will also serve my home VPN, I want **ad-blocking** capabilities,
ideally based on blocklists.

My first thought was using CordeDNS. It is popular and robust, and someone [even started
a PR](https://github.com/coredns/coredns/pull/5833) to integrate with Nomad's API.
Unfortunately not only the PR stalled, but at the time of writing CoreDNS did not support
ad-blocking either. Given I couldn't find any other DNS servers with a Nomad integration,
I decided to fall back to using fancy [Nomad templates](https://developer.hashicorp.com/nomad/docs/networking/service-discovery)
on top of the DNS config - this opened up the door to using any DNS server
that uses a config file for custom DNS entries. 

I decided to use [grimd](https://github.com/looterz/grimd) - it supports blocklists and, unlike
[blocky](https://github.com/0xERR0R/blocky), it is capable of SRV records!

And so I found [this gem of a gist by m1keil](https://gist.github.com/m1keil/d0ef68c4277712a5b0ce2cf74743f18e),
which uses some serious template-fu to dynamically
create A and SRV records based on Nomad's service catalog.
We can adapt this a bit to grimd config, remove dealing with Nomad tags, and shove this in grimd's TOML
config:

```toml
# file: grimd/config.toml (template) #
customdnsrecords = [
    {{- $base_domain := ".nomad" -}} {{- /* Change this field for a diferent tld! */ -}}
    {{- $ttl := 3600 -}}             {{- /* Change this field for a diferent ttl! */ -}}
    {{ $rr_a := sprig_list -}}
    {{- $rr_srv := sprig_list -}}

    {{- /* Iterate over all of the registered Nomad services */ -}}
    {{- range nomadServices -}}
    {{ $service := . }}

    {{- /* Iterate over all of the instances of a services */ -}}
    {{- range nomadService $service.Name -}}
    {{ $svc := . }}


    {{- /* Generate a unique label for IP */ -}}
    {{- $node := $svc.Address | md5sum | sprig_trunc 8 }}

    {{- /* Record A & SRV RRs */ -}}
    {{- $rr_a = sprig_append $rr_a (sprig_list $svc.Name $svc.Address) -}}
    {{- $rr_a = sprig_append $rr_a (sprig_list $node $svc.Address) -}}
    {{- $rr_srv = sprig_append $rr_srv (sprig_list $svc.Name $svc.Port $node) -}}
    {{- end -}}
    {{- end -}}

    {{- /* Iterate over lists and print everything */ -}}

    {{- /* Only the latest record will get returned - see https://github.com/looterz/grimd/issues/114 */ -}}
    {{ range $rr_srv -}}
    "{{ printf "%-45s %s %s %d %d %6d %s" (sprig_nospace (sprig_cat (index . 0) $base_domain ".srv")) "IN" "SRV" 0 0 (index . 1) (sprig_nospace (sprig_cat (index . 2) $base_domain)) }}",
    {{ end -}}

    {{- range $rr_a | sprig_uniq -}}
    "{{ printf "%-45s %4d %s %4s %s" (sprig_nospace (sprig_cat (index . 0) $base_domain)) $ttl "IN" "A" (sprig_last . ) }}",
    {{ end }}

]
```

This will result in the following DNS records...

```toml
# file: grimd/config.toml (rendered result) #
customdnsrecords = [
    "traefik.nomad.srv                              IN SRV 0 0   8080 029c1900",
    "traefik-metrics.nomad.srv                      IN SRV 0 0  31934 029c1900",
    "web-portfolio.nomad.srv                        IN SRV 0 0  28740 0543953b",
    "web-portfolio.nomad.srv                        IN SRV 0 0  23107 029c1900",
    "whoami.nomad.srv                               IN SRV 0 0  27465 c3b8ae24",

    "c3b8ae24.nomad                                3600 IN    A 10.10.1.1",
    "029c1900.nomad                                3600 IN    A 10.8.0.1",
    "0543953b.nomad                                3600 IN    A 10.8.0.5",
    "traefik-metrics.nomad                         3600 IN    A 10.8.0.1",
    "web-portfolio.nomad                           3600 IN    A 10.8.0.5",
    "web-portfolio.nomad                           3600 IN    A 10.8.0.1",
    "whoami.nomad                                  3600 IN    A 10.10.1.1",
]
```

...for the following services:

| Service name             | Address         |
|--------------------------|-----------------|
| `traefik`   &emsp;       | 10.8.0.1:8080   |
| `traefik-metrics` &emsp; | 10.8.0.1:31934  |
| `whoami`        &emsp;   | 10.10.1.1:27465 |
| `web-portfolio`  &emsp;  | 10.8.0.5:28740  |
| `web-portfolio`  &emsp;  | 10.8.0.1:23107  |

I find the trick of mapping an IP to a unique hash, which goes in an A record and then point
the SRV record to that hash genius. I wish I could take credit for that!

There is a caveat to this poor man's Consul, which comes in form of [a bug present in grimd](https://github.com/looterz/grimd/issues/114):
**only a single DNS record (be it A or SRV) will be returned in lookups**. For now this does
not bother me too much, but it is definitely a deal-breaker for using SRV and A records at the same
time, with the same domain (not the case here). I mitigated this in the snippet given
above by using different
hostnames for SRV records (`.nomad.srv`) vs A records (`nomad`).

## Conclusion
You _mostly_ don't need Consul if all you want is service discovery based on templates - which
itself is something you can leverage to make service discovery based on DNS! 

This is ideal for smaller Nomad setups where you do not want to deploy a Consul cluster and you
also would like your DNS server to perform ad-blocking.


## References
- [Nomad service discovery (blog)](https://www.hashicorp.com/blog/nomad-service-discovery)
- [Nomad service discovery (docs)](https://developer.hashicorp.com/nomad/docs/networking/service-discovery)
- [Nomad templates (docs)](https://developer.hashicorp.com/nomad/tutorials/templates)
- [looterz/grimd (Github)](https://github.com/looterz/grimd)
- [The genius gist by m1keil (Github)](https://gist.github.com/m1keil/d0ef68c4277712a5b0ce2cf74743f18e)