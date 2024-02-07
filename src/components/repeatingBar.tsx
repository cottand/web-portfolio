/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
import {useTheme} from "@mui/material";
import {css} from "@emotion/react";

export const RepeatingBar: FC = () => {
    let accentColour = useTheme().palette.primary.main
    return <hr css={css`
            background: repeating-linear-gradient(90deg, ${accentColour}, ${accentColour} 4px, transparent 0, transparent 10px);
            height: 20px;
            display: block;
            border: none;
        `}/>
}