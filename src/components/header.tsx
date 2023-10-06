/** @jsxImportSource @emotion/react */
import React from 'react';
import {FC} from "react";
import {Typography} from "@mui/material";
import {css} from "@emotion/react";
import {ChangeColorButton} from "./colorToggle";

export const Header: FC = () => {

    return <div css={css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
        <Typography variant='inherit' css={css`
          letter-spacing: 1px;
          font-weight: bold;
          float: left;
          padding-top: 10px;
          padding-left: 14px;
          padding-bottom: 6px;
          //text-shadow: 1px 1px;
          font-size: 48px;
          @media not screen and (max-width: 550px) {
            padding-bottom: 10px;
            font-size: 64px;
          };
          //font-family: 'Fira Code', monospace;
        `}>Nico D'Cotta</Typography>
        <div css={css`
          padding-top: 10px;
        `}>
            <ChangeColorButton/>
        </div>
    </div>
        ;
};
