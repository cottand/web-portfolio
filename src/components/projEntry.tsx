/** @jsxImportSource @emotion/react */
import React, {FC, lazy, useRef} from "react";
import {CardContent, Divider, Link, SvgIconProps, Typography, useTheme} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import styles from "../portfolio.module.css";
import {css} from "@emotion/react";
import {PanelEntry, PanelName} from "./projectPanels";

type EntryProps = PanelEntry & {
    aligned: boolean
}

const ProjEntry: FC<EntryProps> = (props) => {
    const commonIconProps: SvgIconProps = {
        fontSize: "large",
    };
    const HeadingTypo = () => <Typography
        // css={css`padding-left: 4px`}
        // fontSize={"20px"}
        // fontWeight={"bold"}
        variant={"h5"}
    >{props.name}</Typography>
    const Heading = () =>
        <div className={styles.heading} css={css`flex-direction: ${props.aligned ?  'column' : 'row'}`}>
            <props.icon {...commonIconProps}/>
            <HeadingTypo/>
        </div>
    const Subheading = () => {
        const theme = useTheme()
        return <Typography
            color={theme.palette.text.secondary}
            className={styles.subheading}>{props.summary}</Typography>
    }

    return <>
            <Heading/>
            <Subheading/>
        </>
}

export default ProjEntry