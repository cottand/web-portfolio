/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
import {css} from "@emotion/react";
import {CardContent, Link, Typography, useTheme} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import {MdRenderer} from "../markdown/MdFile";
import {useParams} from "react-router-dom";
import {projectFromId} from "../projectPanels";
import {RepeatingBar} from "../repeatingBar";

export const ProjPage: FC = () => {
    let projectId = useParams<{ projectId: string }>().projectId
    let project = projectFromId(projectId)
    // @ts-ignore
    let gh = project?.gh
    // @ts-ignore
    // const projectId = loaderData.id


    return <CardContent>
        <Typography variant={"h3"}>{project?.name}</Typography>
        <RepeatingBar/>

        <div css={css`width: 100%; padding-top: 14px;`}>
        {gh === undefined ? (<div/>) : (<GithubBanner repo={gh}/>)}
        {gh === undefined ? (<div/>) : (<br/>)}
    </div><MdRenderer foldCode={false} makeAnchors/>
    </CardContent>
}

function GithubBanner(props: { repo: string }) {
    const svgWidth = "24px"
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
