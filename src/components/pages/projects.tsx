/** @jsxImportSource @emotion/react */
import React, {Fragment, Suspense, useEffect, useState} from "react";
import {css} from "@emotion/react";
import {panels} from "../projectPanels";
import {Spinner} from "../spinner";
import {Card, CardActionArea, CardContent, Grid, List, ListItemButton, useTheme} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import ProjEntry from "../projEntry";


export function Projects() {
    const [aligned, setAligend] = useState(window.innerWidth > 600);
    const updater = () => setAligend(window.innerWidth > 600);
    useEffect(() => {
            window.addEventListener("resize", updater);
            return () => window.removeEventListener("resize", updater);
        }
    );

    const theme = useTheme()


    return (
        <Fragment
            // css={css`width: 100%`}
        >
            <Grid container spacing={2}
                  alignItems={"center"}
                  justifySelf={"center"}
                  direction={"row"}
                  justifyContent={"center"}
                  sx={{
                      // width: "100%",
                      // display: "flex",
                      // flexDirection: "column",
                      // alignContent: "flex-start",
                      // flex: "1 1 0px",
                      flexGrow: "0",
                      flexWrap: "wrap",
                      alignItems: "stretch",
                  }}

            >
                {panels.map((p) => (
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{height: "100%"}}>
                            <CardActionArea
                                sx={{height: "100%"}}
                                component={RouterLink as any}
                                key={p.id}
                                to={p.id}

                                // divider={true}
                            >
                                <CardContent css={css`
                                    width: 100%;
                                    height: 100%
                                `}>
                                    <Suspense fallback={<Spinner/>}>
                                        <ProjEntry
                                            key={p.name}
                                            aligned={aligned}
                                            {...p}
                                        />
                                    </Suspense>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Fragment>
    )
}

