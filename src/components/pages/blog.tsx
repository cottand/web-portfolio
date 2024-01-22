/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
import {List, ListItemButton, ListItemText, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
// import {MdRenderer} from "../markdown/MdFile";
import markdownBlogEntries from "../const/markdownBlogEntries";


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
        {/*<Entry type={"talk"}*/}
        {/*       title={"Adding Pattern Matching to Kotlin"}*/}
        {/*       href={"https://youtu.be/Blj-7SGYUnE?t=215"}*/}
        {/*       date={"01/07/2020"}*/}
        {/*       key={"sePatterns"}*/}
        {/*       divider={false}*/}
        {/*/>*/}
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

