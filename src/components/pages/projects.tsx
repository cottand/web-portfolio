/** @jsxImportSource @emotion/react */
import React, {FC, lazy, startTransition, Suspense, useEffect, useState, useTransition} from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import {css} from "@emotion/react";
import {PanelEntry, PanelName, panels} from "../projectPanels";
import {Spinner} from "../spinner";
import {List, ListItemButton, ListItemText, Typography} from "@mui/material";
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


    return (
        <div css={css`width: 100%`}>
            <List>
                {panels.map((p) => (
                    <ListItemButton component={RouterLink as any}
                                    key={p.id}
                                    to={p.id}
                                    divider={true}
                    ><Suspense fallback={<Spinner/>}>
                        <ProjEntry
                            key={p.name}
                            aligned={aligned}
                            {...p}
                        />
                    </Suspense>
                    </ListItemButton>
                ))}
            </List>
        </div>
    )
}

