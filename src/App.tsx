/** @jsxImportSource @emotion/react */
import React, {FC} from 'react';
import './App.css';
import {css} from "@emotion/react";
import {BrowserRouter, useNavigate, useRouteError} from "react-router-dom";
import {Breadcrumbs, Link, Typography, useTheme} from "@mui/material";
import {Root} from './root';

const App: FC = () => {
    const theme = useTheme()
    // noinspection CssInvalidPropertyValue
    return <div
        css={css`
            @media not screen and (max-width: 50px) {
                padding: 7px;
            };
            @media not screen and (max-width: 550px) {
                padding: 14px;
            };
            background-size: cover;
            overflow: scroll;
            overflow: overlay;
            background-attachment: fixed;
            background-repeat: no-repeat;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
                // background: ${theme.palette.mode === 'dark' ? theme.palette.background.default : undefined};
        `}
    >
        <div css={css`
            align-self: center;
            width: min(900px, 100%);
        `}>
                <Root/>
        </div>
    </div>;
};

export default App;
