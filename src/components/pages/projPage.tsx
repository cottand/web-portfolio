/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
import {css} from "@emotion/react";
import {Card, CardContent, Link, Paper, Typography, useTheme} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import {MdRenderer} from "../markdown/MdFile";
import {useLoaderData, useMatch} from "react-router-dom";

export const ProjPage: FC = () => {
    // @ts-ignore
    const gh = useLoaderData().gh
    return <CardContent>
            <div className={css`width: 100%`.name}>
                {gh === undefined ? (<div/>) : (<GithubBanner repo={gh}/>)}
                {gh === undefined ? (<div/>) : (<br/>)}
            </div>
            <MdRenderer foldCode={false}/>
        </CardContent>
}

function GithubBanner(props: { repo: string }) {
    const svgWidth = "32px"
    const theme = useTheme()
    return (
        <div
            css={css`text-align: center;
                position: relative;
                width: fit-content;
                height: fit-content;
            `}
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
