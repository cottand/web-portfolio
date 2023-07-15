/** @jsxImportSource @emotion/react */
import React from 'react';
import {FC} from "react";
import {Typography} from "@mui/material";
import {css} from "@emotion/react";

export const Header: FC = () => (
            <Typography variant='inherit' css={css`
              //color: white;
              letter-spacing: 1px;
              font-weight: bold;
              padding-top: 10px;
              padding-left: 14px;
              padding-bottom: 10px;
              //text-shadow: 1px 1px;
              font-size: 64px;
              //font-family: 'Fira Code', monospace;
            `}>Nico D'Cotta</Typography>
    );
