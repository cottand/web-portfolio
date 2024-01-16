/** @jsxImportSource @emotion/react */
import React, {FC, lazy, Suspense, useEffect, useState} from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import {css} from "@emotion/react";
import {PanelEntry, PanelName, panels} from "../projectPanels";
import { Spinner } from "../spinner";


const ProjEntry = lazy(() => import("../projEntry"))

export default function Projects() {
    const [expanded, setExpanded] = useState<PanelName | null>(null);
    const handleChange = (panel: PanelName) => (_: any, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : null)
    };
    const [aligned, setAligend] = useState(window.innerWidth > 600);
    const updater = () => setAligend(window.innerWidth > 600);
    useEffect(() => {
            window.addEventListener("resize", updater);
            return () => window.removeEventListener("resize", updater);
        }
    );

    return (
        <div css={css`width: 100%`}>
            {panels.map((p) => (
                <Suspense fallback={<Spinner/>}>
                    <ProjEntry
                        key={p.name}
                        handleChange={handleChange(p.name)}
                        expandedPanel={expanded}
                        aligned={aligned}
                        {...p}
                    />
                </Suspense>
            ))}
        </div>
    )
}


