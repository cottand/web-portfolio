/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {Box} from "@mui/material";
import React from "react";

interface TabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
}

export function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            css={css`
              width: min(860px, 100%);
              align-self: center;
            `}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}

            {...other}
        >
            {value === index && (<Box>{children}</Box>)}
        </div>
    );
}
