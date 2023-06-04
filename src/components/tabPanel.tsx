/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import Box from "@mui/material/Box";
import {ReactNode} from "react";

interface TabPanelProps {
    children: ReactNode;
    value: number;
    index: number;
    keepMountedOnHide?: boolean;
}

export function TabPanel(props: TabPanelProps) {
    const {children, value, index, keepMountedOnHide, ...other} = props;
    const hidden = value !== index;

    const keepMounted = keepMountedOnHide ?? false
    return (
        <div
            css={css`
              width: min(1000px, 100%);
              align-self: center;
            `}
            role="tabpanel"
            hidden={hidden}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}

            {...other}
        >
            {(!hidden || keepMounted) && <Box>{children}</Box>}
        </div>

    );
}
