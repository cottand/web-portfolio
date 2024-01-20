import nixShellHash from "../../assets/markdown/blog/NixShellFlakeScriptingForHashLanguages.md";
import gradleRepro from "../../assets/markdown/blog/ReproducibleCacheableGradleDocker.md";
import nomadDnsAdblock from "../../assets/markdown/blog/DNSServiceDiscoveryAdblockingNomad.md";
import nomadNixos from "../../assets/markdown/blog/NomdAndNixOS.md";

const markdownBlogEntries: { title: string, date: string, ref: string, file: string }[] = [
    {
        title: "Scripting via the Nix shell with hash languages",
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
        title: "Nomad + NixOS",
        ref: "nomadNixos",
        date: "22/05/2023",
        file: nomadNixos,
    }
]
export default markdownBlogEntries