/** @jsxImportSource @emotion/react */
import React, {FC, Fragment} from "react";
import {css} from "@emotion/react";
import {Link, Paper, Typography, useTheme} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import MdRenderer from "../markdown/MdFile";

export const ProjPage: FC<{gh: string, markdown: string}> = (props) =>  <Paper>
                <div className={css`width: 100%`.name}>
                    {props.gh === undefined ? (<div/>) : (<GithubBanner repo={props.gh}/>)}
                    {props.gh === undefined ? (<div/>) : (<br/>)}
                </div>
                <MdRenderer foldCode={false} file={props.markdown}/>
</Paper>

function GithubBanner(props: { repo: string }) {
    const svgWidth = "32px"
    const theme = useTheme()
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
                        vertical-align: center;
                        position: absolute`}/>
                </div>
                <Typography
                    css={css`padding-left: calc(${svgWidth} + ${theme.spacing(1)});
                        height: fit-content;
                        line-height: ${svgWidth};`}>
                    {props.repo}
                </Typography>
            </Link>
        </div>
    )
}
