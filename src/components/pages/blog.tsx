/** @jsxImportSource @emotion/react */
import React, {FC, lazy, Suspense} from "react";
import {Card, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import {Link as RouterLink, Route, Routes, useNavigate} from "react-router-dom";
// import {MdRenderer} from "../markdown/MdFile";
import nomadNixos from "../../assets/markdown/blog/NomdAndNixOS.md"
import nomadDnsAdblock from "../../assets/markdown/blog/DNSServiceDiscoveryAdblockingNomad.md"
import gradleRepro from "../../assets/markdown/blog/ReproducibleCacheableGradleDocker.md"
import nixShellHash from "../../assets/markdown/blog/NixShellFlakeScriptingForHashLanguages.md"
import {css} from "@emotion/react";
import {Spinner} from "../spinner";
import MdRenderer from "../markdown/MdFile";

export const markdownBlogEntries: { title: string, date: string, ref: string, file: string }[] = [
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

export const Blog: FC = () => (
    <Card css={css`min-height: 400px`} elevation={0}>
        <Routes>
            {markdownBlogEntries.map(e =>
                <Route path={e.ref} key={e.ref} element={<BlogEntry file={e.file}/>}/>
            )}
            {/*// this one is for backwards compatibility*/}
            <Route path="nomad"
                element={<BlogEntry file={nomadNixos}/>}
            />
            <Route path="*"
                element={<BlogEntriesList/>}
            />
        </Routes>
    </Card>
)

// noinspection HtmlUnknownAttribute
export const BlogEntry: FC<{ file: string }> = (props) =>
    <div css={css`padding: 20px`}>
        <MdRenderer foldCode={true} extendGhm={true} makeAnchors={true} {...props}/>
    </div>

export const BlogEntriesList: FC = () =>
    <List component={"nav"}>
        {markdownBlogEntries.map(e =>
            <Entry type={"blog"}
                   title={e.title}
                   href={e.ref}
                   // href={"/blog/" + e.ref}
                   date={e.date}
                   key={e.ref}
            />
        )}
        <Entry type={"article"}
               title={"Detailed Case Study of Blockchain.com, a Fast-growing Cryptocurrency Company"}
               href={"https://github.com/Cottand/articles/raw/master/blockchainCaseStudy.pdf"}
               date={"29/02/2022"}
               key={"bcCrypto"}
        />
        <Entry type={"article"}
               title={"At Scale, Is it Worth Compromising on Stability for the Sake of Throughput?"}
               href={"https://github.com/Cottand/articles/raw/master/stabilityVsThroughput.pdf"}
               date={"24/02/2022"}
               key={"seScale"}
        />
        <Entry type={"article"}
               title={"When Are Microservice Architectures Beneficial?"}
               href={"https://github.com/Cottand/articles/raw/master/whenMicroservices.pdf"}
               date={"21/02/2022"}
               key={"seMicroS"}
        />
        <Entry type={"talk"}
               title={"Adding Pattern Matching to Kotlin"}
               href={"https://youtu.be/Blj-7SGYUnE?t=215"}
               date={"01/07/2020"}
               key={"sePatterns"}
               divider={false}
        />
    </List>


type Type = "blog" | "talk" | "article"

const Entry: FC<{ type: Type; title: string; href: string; date: string; divider?: boolean; key: string }> = (props) =>
    <ListItemButton component={RouterLink as any} to={props.href} divider={props.divider ?? true}
        // onClick={onClick}
    >
        <div>
            <Typography variant={"caption"}>{props.date}</Typography>
            <ListItemText secondary={props.type}>{props.title}</ListItemText>
        </div>
    </ListItemButton>

