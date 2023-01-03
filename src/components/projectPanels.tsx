import djStreamr from "../assets/markdown/projects/DJStreamr.md";
import ivann from "../assets/markdown/projects/Ivann.md";
import wacc from "../assets/markdown/projects/Wacc.md"
import paxos from "../assets/markdown/projects/Paxos.md"
import keep from "../assets/markdown/projects/keep213.md"
import ichack from "../assets/markdown/projects/ichack19.md"
import web from "../assets/markdown/projects/website.md"
import pintos from "../assets/markdown/projects/Pintos.md"
import checkm8 from "../assets/markdown/projects/Checkm8.md"
import confis from "../assets/markdown/projects/Confis.md"

export type PanelName = string

export interface PanelEntry {
    name: PanelName,
    markdown: string,
    summary: string,
    gh?: string
}

export const panels: PanelEntry[] = [
    {
      name: "Confis"  ,
        markdown: confis,
        summary: "Framework for specifying and querying legal agreements",
        gh: "cottand/confis",
    },
    {
        name: "DJStreamr",
        markdown: djStreamr,
        summary: "Full-stack collaborative live DJ software",
    },
    {
        name: "Ivann",
        markdown: ivann,
        summary: "Web visual neural network builder",
        gh: "icivann/ivann"
    },
    {
        name: "WACC",
        markdown: wacc,
        summary: "Multiplatform compiler of a small language for ARM and the JVM",
        gh: "cottand/wacc",
    },
    {
        name: "Paxos",
        markdown: paxos,
        summary: "An implementation of the Multi-Paxos consensus algorithm",
        gh: "cottand/multi-paxos",
    },
    {
        name: "KEEP 213",
        markdown: keep,
        summary: "Pattern matching proposal for the Kotlin language",
        gh: "cottand/KEEP/blob/pattern-matching/proposals/pattern-matching.md",
    },
    {
        name: "ICHack 19",
        markdown: ichack,
        summary: "Hackathon project on AR-assisted teaching",
        gh: "cottand/ICHack19"
    },
    {
        name: "This website",
        markdown: web,
        summary: "Made with React",
        gh: "cottand/web-portfolio"
    },
    {
        name: "PintOS",
        markdown: pintos,
        summary: "UNIX-like pint-sized OS",
        gh: "cottand/pintos"
    },
    {
        name: "Checkm8",
        markdown: checkm8,
        summary: "Chess player through computer vision and smart contracts",
        gh: "cottand/checkm8-public",
    }
]
