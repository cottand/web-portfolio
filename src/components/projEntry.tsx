/** @jsxImportSource @emotion/react */
import React, {FC, lazy, useRef} from "react";
import {Link, Typography, useTheme} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import styles from "../portfolio.module.css";
import {css} from "@emotion/react";
import {PanelEntry, PanelName} from "./projectPanels";

type EntryProps = PanelEntry & {
    aligned: boolean
}

const ProjEntry: FC<EntryProps> = (props) => {
    const HeadingTypo = () => <Typography
        css={css`padding-left: 4px`}
        fontSize={"20px"}
        fontWeight={"bold"}
    >{props.name}</Typography>
    const Heading = () =>
        <div className={styles.heading}>
            {props.icon ?? <></>}
            <HeadingTypo/>
        </div>
    const Subheading = () => {
        const theme = useTheme()
        return <Typography
            color={theme.palette.text.secondary}
            className={styles.subheading}>{props.summary}</Typography>
    }


    const ref = useRef<HTMLDivElement>(null)
    return props.aligned ? <>
                <Heading/>
                <Subheading/>
            </>
        :
            <div css={css`vertical-align: middle`}>
                <Heading/>
                <Subheading/>
            </div>

}

export default ProjEntry