/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Link, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GitHubIcon from '@mui/icons-material/GitHub';
import styles from "../portfolio.module.css";
import {css} from "@emotion/react";
import {theme} from "../App";
import {MdRenderer} from "./MdFile";
import {PanelEntry, PanelName, panels} from "./projectPanels";

type EntryProps = PanelEntry & {
    handleChange: (event: any, expanded: boolean) => void
    expandedPanel: PanelName | null
    aligned: boolean
}

function ProjEntry(props: EntryProps) {
    const Heading = ()  => (<Typography fontSize={"30px"} className={styles.heading}>{props.name}</Typography>)
    const Subheading = () => (<Typography color={theme.palette.grey.A700} className={styles.subheading}>{props.summary}</Typography>)

    return (
        <Accordion expanded={props.expandedPanel === props.name} onChange={props.handleChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon color={"primary"}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                {props.aligned
                    ? (
                        <>
                            <Heading/>
                            <Subheading/>
                        </>
                    )
                    : (
                        <div css={css`vertical-align: middle`}>
                            <Heading/>
                            <Subheading/>
                        </div>
                    )}
            </AccordionSummary>
            <AccordionDetails>
                <div className={css`width: 100%`.name}>
                    {props.gh === undefined ? (<div/>) : (<GithubBanner repo={props.gh}/>)}
                    {props.gh === undefined ? (<div/>) : (<br/>)}
                </div>
                <MdRenderer file={props.markdown} centered={false}/>
            </AccordionDetails>
        </Accordion>
    )
}

export function Projects() {
    const [expanded, setExpanded] = useState<PanelName | null>(null);
    const handleChange = (panel: PanelName) => (_: any, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : null)
    };
    const [aligned, setAligend] = useState(window.innerWidth > 600);
    const updater = () => {
        setAligend(window.innerWidth > 600)
    };
    useEffect(() => {
            window.addEventListener("resize", updater);
            return () => window.removeEventListener("resize", updater);
        }
    );

    function entry(e: PanelEntry) {
        return (<ProjEntry
            aligned={aligned}
            markdown={e.markdown}
            summary={e.summary}
            gh={e.gh} name={e.name} handleChange={handleChange(e.name)} expandedPanel={expanded}
        />)
    }

    return (<div className={css`width: 100%`.name}>
        {panels.map((p) => (
            <ProjEntry
                handleChange={handleChange(p.name)}
                expandedPanel={expanded}
                aligned={aligned}
                {...p}
            />
        ))}
    </div>)

}

function GithubBanner(props: { repo: string }) {
    const svgWidth = "32px"
    return (
        <div
            css={css`text-align: center;
              position: relative;
              width: fit-content;
              height: fit-content`}
        >

            <Link href={`https://github.com/${props.repo}`}>
                <div
                    css={css`float: left`}
                >
                    <GitHubIcon css={css`width: ${svgWidth};
                      height: ${svgWidth};
                      position: absolute`}/>
                </div>
                <Typography
                    // TODO SPACING
                    css={css`padding-left: calc(${svgWidth} + ${theme.spacing(1)});
                      height: ${svgWidth};
                      line-height: ${svgWidth};`}>
                    {props.repo}
                </Typography>
            </Link>
        </div>
    )
}

