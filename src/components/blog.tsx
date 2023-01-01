import React, {FC} from "react";
import {Card, List, ListItemButton, ListItemText, Typography} from "@mui/material";

export const Blog = () => (
    <Card>
        <List component={"nav"}>
            <Entry
                type = {"article"}
                title ={"Detailed Case Study of Blockchain.com, a Fast-growing Cryptocurrency Company"}
                href ={"https://github.com/Cottand/articles/raw/master/blockchainCaseStudy.pdf"}
                date = {"29/02/22"}
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
    </Card>
);


type Type = "blog" | "talk" | "article"

const Entry: FC<{ type: Type; title: string; href: string; date: string; divider?: boolean }> = (props) => (
    <ListItemButton href={props.href} divider={props.divider ?? true}>
        <div>
            <Typography variant={"caption"}>{props.date}</Typography>
            <ListItemText secondary={props.type}>{props.title}</ListItemText>
        </div>
    </ListItemButton>
)
