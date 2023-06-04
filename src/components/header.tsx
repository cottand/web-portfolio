/** @jsxImportSource @emotion/react */
import React from 'react';
import {FC} from "react";
import {Typography} from "@mui/material";
import {css} from "@emotion/react";

const Header: FC = () => (
            <Typography variant='h3' fontFamily={"'Fira Code', monospace"} css={css`
              color: white;
              letter-spacing: 1px;
              font-weight: bold;
              padding-top: 6px;
              padding-left: 14px;
              padding-bottom: 10px;
              text-shadow: 1px 1px;
              font-family: 'Fira Code', monospace;
            `}>Nico D'Cotta</Typography>
    );


export default Header;
