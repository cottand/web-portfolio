/** @jsxImportSource @emotion/react */
'use client'
import React from 'react';
import {FC} from "react";
import {Typography} from "@mui/material";
import {css} from "@emotion/react";
import {ChangeColorButton} from "./colorToggle";
import {useLocation} from "react-router-dom";
import {usePathname} from "next/navigation";

export const Header: FC = () => {

    const pathname = usePathname()

    const smallHeader = pathname.split("/").length > 2
    const fontSize = smallHeader ? 42 : 64

    console.log(pathname.split("/"))

    return <div css={css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `}>
        <Typography variant='inherit' css={css`
          letter-spacing: 1px;
          font-weight: 500;
          float: left;
          padding-top: 10px;
          padding-left: 14px;
          padding-bottom: 6px;
          //text-shadow: 1px 1px;
          font-size: ${fontSize}px;
          @media not screen and (max-width: 550px) {
            padding-bottom: 10px;
            font-size: ${fontSize}px;
          };
          //font-family: 'Fira Code', monospace;
        `}>Nico D'Cotta</Typography>
        <div css={css`
          padding-top: 10px;
          padding-right: 10px;
        `}>
            <ChangeColorButton/>
        </div>
    </div>
        ;
};
