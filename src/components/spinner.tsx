/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
import {CircularProgress} from "@mui/material";
import {css} from "@emotion/react";

export const Spinner: FC<{}> = () => <CircularProgress css={css`
     margin-left: 50%;
    margin-right: 50%;
 `}/>