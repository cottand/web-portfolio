/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
import {Card, List, ListItemButton, ListItemText, Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import {MdRenderer} from "./MdFile";
import nomad from "../assets/markdown/blog/NomdAndNixOS.md"
import {css} from "@emotion/react";

export const Blog = () => (
    <Card css={css`min-height: 400px`}>
        <Routes>
            <Route
                path="/blog/nomad"
                element={<BlogEntry file={nomad}/>}
            />
            <Route
                path="/blog"
                element={<BlogEntriesList/>}
            />
            <Route
                path="*"
                element={<BlogEntriesList/>}
            />
        </Routes>
    </Card>
)

// noinspection HtmlUnknownAttribute
export const BlogEntry: FC<{ file: string }> = (props) =>
    <div css={css`padding: 20px`}>
        <MdRenderer foldCode={true} {...props}/>
    </div>

export const BlogEntriesList: FC = () =>
    <List component={"nav"}>
        <Entry
            type={"blog"}
            title={"Nomad + NixOS"}
            href={"/#/blog/nomad"}
            date={"29/02/22"}
        />
        <Entry
            type={"article"}
            title={"Detailed Case Study of Blockchain.com, a Fast-growing Cryptocurrency Company"}
            href={"https://github.com/Cottand/articles/raw/master/blockchainCaseStudy.pdf"}
            date={"29/02/22"}
        />
        <Entry
            type={"article"}
            title={"At Scale, Is it Worth Compromising on Stability for the Sake of Throughput?"}
            href={"https://github.com/Cottand/articles/raw/master/stabilityVsThroughput.pdf"}
            date={"24/02/22"}
        />
        <Entry type={"article"}
               title={"When Are Microservice Architectures Beneficial?"}
               href={"https://github.com/Cottand/articles/raw/master/whenMicroservices.pdf"}
               date={"21/02/22"}
        />
        <Entry type={"talk"}
               title={"Adding Pattern Matching to Kotlin"}
               href={"https://youtu.be/Blj-7SGYUnE?t=215"}
               date={"01/07/20"}
               divider={false}
        />
    </List>


type Type = "blog" | "talk" | "article"

const Entry: FC<{ type: Type; title: string; href: string; date: string; divider?: boolean }> = (props) => (
    <ListItemButton href={props.href} divider={props.divider ?? true}>
        <div>
            <Typography variant={"caption"}>{props.date}</Typography>
            <ListItemText secondary={props.type}>{props.title}</ListItemText>
        </div>
    </ListItemButton>
)
