import djStreamr from "../assets/markdown/projects/DJStreamr.md";
import selfhosted from "../assets/markdown/projects/Selfhosted.md";
import leng from "../assets/markdown/projects/Leng.md";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import ivann from "../assets/markdown/projects/Ivann.md";
import wacc from "../assets/markdown/projects/Wacc.md"
import paxos from "../assets/markdown/projects/Paxos.md"
import keep from "../assets/markdown/projects/keep213.md"
import ichack from "../assets/markdown/projects/ichack19.md"
import web from "../assets/markdown/projects/website.md"
import pintos from "../assets/markdown/projects/Pintos.md"
import checkm8 from "../assets/markdown/projects/Checkm8.md"
import confis from "../assets/markdown/projects/Confis.md"
import Balance from "@mui/icons-material/Balance";
import StorageIcon from '@mui/icons-material/Storage';
import React from "react";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import Handshake from "@mui/icons-material/Handshake";
import Code from "@mui/icons-material/Code";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DataObjectIcon from '@mui/icons-material/DataObject';
import WebIcon from '@mui/icons-material/Web';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import AlbumIcon from '@mui/icons-material/Album';

export type PanelName = string

export interface PanelEntry {
    id: string,
    name: PanelName,
    markdown: string,
    summary: string,
    icon?: React.ReactElement,
    gh?: string
}

const commonIconProps: { fontSize?: "large" } = { fontSize : "large" };

export const findMarkdownFileFromId: (id: string) => string | undefined =
    (id: string) => panels.find(p => p.id == id)?.markdown

export const panels: PanelEntry[] = [
    {
        id: "leng",
        name: "Leng DNS"  ,
        markdown: leng,
        summary: "DNS proxy server with ad-blocking",
        gh: "cottand/leng",
        icon: <DynamicFormIcon {...commonIconProps} />
    },
    {
        id: "selfhosted-homelab",
        name: "Selfhosted Infra"  ,
        markdown: selfhosted,
        summary: "Home SRE-like infra deployment, on my own hardware",
        gh: "cottand/selfhosted",
        icon: <StorageIcon {...commonIconProps} />
    },
    {
        id: "confis",
        name: "Confis"  ,
        markdown: confis,
        summary: "Framework for specifying and querying legal agreements",
        gh: "cottand/confis",
        icon: <Balance {...commonIconProps} />
    },
    {
        id: "djstreamr",
        name: "DJStreamr",
        markdown: djStreamr,
        summary: "Full-stack collaborative live DJ software",
        icon: <AlbumIcon {...commonIconProps} />
        // <img src={djStreamrLogo} height={24} alt={"DJStreamr"}/>
    },
    {
        id: "ivann",
        name: "Ivann",
        markdown: ivann,
        summary: "Web visual neural network builder",
        gh: "icivann/ivann",
        icon: <ShareOutlined {...commonIconProps} />,
    },
    {
        id: "wacc",
        name: "WACC",
        markdown: wacc,
        summary: "Multiplatform compiler of a small language for ARM and the JVM",
        gh: "cottand/wacc",
        icon: <DataObjectIcon {...commonIconProps} />,
    },
    {
        id: "paxos",
        name: "Paxos",
        markdown: paxos,
        summary: "An implementation of the Multi-Paxos consensus algorithm",
        gh: "cottand/multi-paxos",
        icon: <Handshake {...commonIconProps} />,
    },
    {
        id: "kotlinKeep213",
        name: "KEEP 213",
        markdown: keep,
        summary: "Pattern matching proposal for the Kotlin language",
        gh: "cottand/KEEP/blob/pattern-matching/proposals/pattern-matching.md",
        icon: <Code {...commonIconProps} />,
    },
    {
        id: "icHack19",
        name: "ICHack 19",
        markdown: ichack,
        summary: "Hackathon project on AR-assisted teaching",
        gh: "cottand/ICHack19",
        icon: <QrCodeScannerIcon {...commonIconProps} />,
    },
    {
        id: "webPortfolio",
        name: "This website",
        markdown: web,
        summary: "Made with React",
        gh: "cottand/web-portfolio",
        icon: <WebIcon {...commonIconProps} />,
    },
    {
        id: "pintOS",
        name: "PintOS",
        markdown: pintos,
        summary: "UNIX-like pint-sized OS",
        gh: "cottand/pintos",
        icon: <SportsBarIcon {...commonIconProps} />,
    },
    {
        id: "checkm8",
        name: "Checkm8",
        markdown: checkm8,
        summary: "Chess player through computer vision and smart contracts",
        gh: "cottand/checkm8-public",
        icon: <EmojiEventsIcon {...commonIconProps} />,
    }
]
