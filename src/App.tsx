/** @jsxImportSource @emotion/react */
import React, {FC} from 'react';
import './App.css';
import {css} from "@emotion/react";
import {BrowserRouter} from "react-router-dom";
import {NavBar} from "./components/navBar";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import styles from "./portfolio.module.css"

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: "#B24F31",// orange-y ish
            light: "rgb(166, 212, 250)",
            dark: "rgb(100, 141, 174)",

        },
        secondary: {
            main: "#651fff",
            light: "#834bff",
            dark: "#4615b2",
        },
        background: {
            default: "#121212"
        },
        action: {
            active: "#fff",
            hover: "rgba(255, 255, 255, 0.08)",
            hoverOpacity: 0.08,
            selected: "rgba(255, 255, 255, 0.16)",
            selectedOpacity: 0.16,
            disabled: "rgba(255, 255, 255, 0.3)",
            disabledBackground: "rgba(255, 255, 255, 0.12)",
            disabledOpacity: 0.38,
            focus: "rgba(255, 255, 255, 0.12)",
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
        }
    },
});

// noinspection CssInvalidPropertyValue
const App: FC = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div
            className={styles.svgBackground}
            css={css`
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
            `}
        >

            <div css={css`
              align-self: center;
              width: min(800px, 100%);
            `}

            >
                <BrowserRouter>
                    <NavBar/>
                </BrowserRouter>
            </div>

        </div>
    </ThemeProvider>
);

export default App;
