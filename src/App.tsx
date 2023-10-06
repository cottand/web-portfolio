/** @jsxImportSource @emotion/react */
import React, {FC} from 'react';
import './App.css';
import {css} from "@emotion/react";
import {BrowserRouter} from "react-router-dom";
import {NavBar} from "./components/navBar";

const App: FC = () => {
    // noinspection CssInvalidPropertyValue
    return <div
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
          width: min(900px, 100%);
        `}>
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        </div>
    </div>;
};

export default App;
