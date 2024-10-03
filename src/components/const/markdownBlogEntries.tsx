import multiArchNix from "../../assets/markdown/blog/MultiArchNixDockerImages.md";
import nixShellHash from "../../assets/markdown/blog/NixShellFlakeScriptingForHashLanguages.md";
import gradleRepro from "../../assets/markdown/blog/ReproducibleCacheableGradleDocker.md";
import nomadDnsAdblock from "../../assets/markdown/blog/DNSServiceDiscoveryAdblockingNomad.md";
import nomadNixos from "../../assets/markdown/blog/NomdAndNixOS.md";
import dockerNotRepro from "../../assets/markdown/blog/MultiStageDockerNotRepro.md";
import monorepoCiReproducibleBuilds from "../../assets/markdown/blog/ReproducibleInCi.md";
import cockroachDS from "../../assets/markdown/blog/CockroachDBDisasterRecovery.md"
import micromodules from "../../assets/markdown/blog/FromMicroservicesToMonolith.md"

export const blogFromRef =
    (ref: string | undefined) => markdownBlogEntries.find(p => p.ref == ref)

const markdownBlogEntries: { title: string, date: string, ref: string, file: string }[] = [
    {
        title: "From microservices to a monolith",
        ref: "FromMicroservicesToMonolith",
        date: "03/10/2024",
        file: micromodules,
    },
    {
        title: "Dumb logic for smart monorepo CI thanks to reproducible builds",
        ref: "MonorepoCiReproducibleBuilds",
        date: "25/08/2024",
        file: monorepoCiReproducibleBuilds,
    },
    {
        title: "CockroachDB quorum loss disaster recovery recovery",
        ref: "CockroachDBDisasterRecovery",
        date: "16/06/2024",
        file: cockroachDS,
    },
    {
        title: "Multi-stage Docker builds are not (usually) reproducible",
        ref: "DockerNotReproducible",
        date: "10/02/2024",
        file: dockerNotRepro,
    },
    {
        title: "Multi-arch Docker Images With Nix on GitHub Actions",
        ref: "MultiArchNixDockerImages",
        date: "20/01/2024",
        file: multiArchNix,
    },
    {
        title: "Scripting compiled languages via the Nix shell",
        ref: "NixShellFlakeScriptingForHashLanguages",
        date: "23/11/2023",
        file: nixShellHash,
    },
    {
        title: "Reproducible and Cacheable builds with Gradle and Docker",
        ref: "ReproducibleCacheableGradleDocker",
        date: "25/08/2023",
        file: gradleRepro,
    },
    {
        title: "Running both ad-blocking and poor man's DNS service-discovery for self-hosted Nomad",
        ref: "DNSServiceDiscoveryAdblockingNomad",
        date: "10/08/2023",
        file: nomadDnsAdblock,
    },
    {
        title: "Using NixOS to swiftly and reproducibly get Nomad clients up and running",
        ref: "nomadNixos",
        date: "22/05/2023",
        file: nomadNixos,
    }
]
export default markdownBlogEntries