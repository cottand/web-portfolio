I run a personal fleet of a few old computers in my living room which run services like
- Personal DB
- Password manager
- Personal storage and backups
- VPN, with adblocking
- ... and hosts some of the projects you see in this website!

<img src="assets/selfhosted1.png" class="centered border-radius" style="width: min(99%, 560px)"
caption="Screenshot of the Nomad Job page for Grafana"
/>

I made it thinking about how I would build a company's fleet as an SRE. It has a mostly open-source stack with:
- Container orchestration through [Nomad](https://www.nomadproject.io/) (an alternative to Kubernetes)
- Metrics, performance monitoring, and logs management through [Grafana](https://grafana.net), [Prometheus](https://prometheus.io/docs/introduction/overview/) and [Loki](https://grafana.com/oss/loki/)
- Secure private networking through [Wireguard](https://www.wireguard.com/)
- Reproducible, declarative deployments of the Linux OSs through [NixOS](https://nixos.org/) (although sometimes I install other OSs on some machines to experiment!)

<img src="assets/selfhosted2.png" class="centered border-radius" style="width: min(99%, 560px)"
caption="Screenshot of a Grafana monitoring dashboard"
/>

Overall, the setup is overkill for what I am running (a few containers, really). I could achieve most of this with SSH and docker compose alone, but
I learnt a great deal of [SRE skills](https://en.wikipedia.org/wiki/Site_reliability_engineering) by trying to make a industry-grade platform that could scale to 10 or 1000 services!

If I was to found a startup tomorrow and had to develop its platform, I would reuse much of the technology I used for this side-project.