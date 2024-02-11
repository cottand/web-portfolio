import {FC, lazy, ReactNode, useEffect} from "react";
import mermaid, {MermaidConfig} from "mermaid";
import ReactMarkdown from "react-markdown";
import children = ReactMarkdown.propTypes.children;
import {Card, CardContent, Container, Grid, Typography, useTheme} from "@mui/material";
import {Await} from "react-router-dom";


export const MermaidDiagram: FC<{ children: ReactNode, caption?: string }> = (props) => {
    const theme = useTheme()
    const mermaidTheme = theme.palette.mode === "dark" ? "dark" : "neutral";
    // const mermaidTheme = "base"

    useEffect(() => {
            mermaid.initialize({
                fontFamily: theme.typography.fontFamily,
                startOnLoad: false,
                securityLevel: "loose",
                theme: mermaidTheme,
            })
        }, [theme]
    )

    useEffect(() => {
        mermaid.contentLoaded()
        mermaid.run().then()
    })

    return (
        <Grid container
              direction="column"
              spacing={1}
              justifyContent={"flex-start"}
              alignItems={"center"}

        >
            <Grid item
                  height={"400px"}
                  xs={11}
                  flexGrow={1}
                  className={"mermaid"}
                  sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center"
                  }}
            >
                {props.children}
            </Grid>
            <Grid item xs={1}>
                <Typography justifyContent={"center"} variant={"caption"}>{props.caption}</Typography>
            </Grid>
        </Grid>
        // <Container sx={{justifyContent: "center", alignItems: "center", display: "flex"}}>
        // </Container>
    )
}