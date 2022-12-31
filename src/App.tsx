/** @jsxImportSource @emotion/react */
import React, {FC} from 'react';
import './App.css';
import {css} from "@emotion/react";
import Header from "./components/header";
import {HashRouter} from "react-router-dom";
import {NavBar} from "./components/navBar";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import background from "./assets/oil1.jpg"

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

const App: FC = () => (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div
                css={css`
                  padding: 16px;
                  background-image: url(${background});
                  background-position: center center;
                  background-size: cover;
                  //min-height: min(100%, 600px);
                  background-attachment: fixed;
                  background-repeat: no-repeat;
                  box-sizing: border-box;
                  display: flex;
                  flex-direction: column;
                  min-height: 100vh;
                `}
            >
                <Header/>
                <HashRouter>
                    <NavBar/>
                </HashRouter>

            </div>
        </ThemeProvider>
    );

export default App;
