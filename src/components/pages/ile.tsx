/** @jsxImportSource @emotion/react */
import React, {useEffect, useRef, useState} from 'react';
import {css} from '@emotion/react';
import {useMediaQuery, useTheme, Button, Snackbar, Alert} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {loadIleWasm} from '../../ile_wasm';
import {useLocation, useNavigate} from "react-router-dom";


function base64ToString(base64String: string): string {
    const binString = atob(base64String);
    let uint8Array = Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
    return new TextDecoder().decode(uint8Array);
}

function stringToBase64(str: string): string {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte),
    ).join("");
    return btoa(binString);
}


export const IleCompiler = () => {
    const [code, setCode] = useState<string>(`package main

fn getMessage() {
    "hello world!"
}

fn main() {
  val msg = getMessage()
  println(msg)
}`);
    const [output, setOutput] = useState<string>('');
    const [goOutput, setGoOutput] = useState<string>('');
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const location = useLocation();
    const navigate = useNavigate();

    // Load WASM when component mounts
    useEffect(() => {
        const initWasm = async () => {
            try {
                await loadIleWasm();

                // Run initial compilation
                if (location.hash) {
                    const hash = location.hash.substring(1);
                    const decoded = base64ToString(hash);
                    handleCodeChange(decoded);
                } else {
                    handleCodeChange(code);
                }
            } catch (error) {
                setOutput(`error initializing WebAssembly: ${error}`);
            }
        };
        initWasm();
    }, []);

    // Handle code changes and recompile on every keystroke
    const handleCodeChange = (newCode: string) => {
        const encoded = stringToBase64(newCode);
        // Update the URL hash with the encoded code
        navigate(`#${encoded}`, {replace: true});

        setCode(newCode);
        try {
            const result = ileCompile(newCode);
            if ('error' in result) {
                setOutput(result.error);
                setGoOutput('');
                return;
            } else {
                setOutput(result.types);

                // @ts-ignore
                window.InterpretGo(result.goOutput)
                    .catch((error: Error) => error.message)
                    .then((str: string) => {
                        setGoOutput(str);
                    })
            }
        } catch (error) {
            setOutput(`Runtime error: ${error}`);
        }
    };

    // Generate share link and copy to clipboard
    const handleShareLink = (content: string) => {
        const encoded = stringToBase64(content);
        const shareLink = `https://nico.dcotta.com/ile#${encoded}`;

        navigator.clipboard.writeText(shareLink)
            .then(() => {
                setSnackbarOpen(true);
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
            });
    };

    return (
        <div css={css`
            display: flex;
            flex-direction: column;
            //height: 100vh;
            width: 100%;
            gap: 16px;
        `}>
            {/* Top row: Input and Go Output side by side on desktop, stacked on mobile */}
            <div css={css`
                display: flex;
                flex-direction: ${isMobile ? 'column' : 'row'};
                gap: 16px;
                flex: 1;
            `}>
                {/* Code input area */}
                <div css={css`
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                `}>
                    <div css={css`
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    `}>
                        <h3>ile code</h3>
                        {/*<Button*/}
                        {/*    variant="outlined"*/}
                        {/*    size="small"*/}
                        {/*    startIcon={<ContentCopyIcon/>}*/}
                        {/*    onClick={() => handleShareLink(code)}*/}
                        {/*>*/}
                        {/*    Share*/}
                        {/*</Button>*/}
                    </div>
                    <textarea
                        ref={inputRef}
                        value={code}
                        rows={code.split('\n').length}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        css={css`
                            flex: 1;
                            font-family: monospace;
                            font-size: 14px;
                            padding: 12px;
                            border: 1px solid ${theme.palette.divider};
                            border-radius: 4px;
                            resize: none;
                            background-color: ${theme.palette.background.paper};
                            color: ${theme.palette.text.primary};
                            min-height: 30vh; /* Approximately 10 lines of text */
                            max-height: 50vh; /* Dynamic height based on content */
                        `}
                    />
                </div>

                {/* Go Output area - next to input on desktop, third on mobile */}
                <div css={css`
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                `}>
                    <h3>Inferred types</h3>
                    <
                        pre
                        // readOnly disabled
                        css={css`
                            flex: 1;
                            font-family: monospace;
                            font-size: 14px;
                            padding: 12px;
                            border: 1px solid ${theme.palette.divider};
                            border-radius: 4px;
                            overflow: auto;
                            white-space: pre-wrap;
                            background-color: ${theme.palette.background.paper};
                            color: ${theme.palette.text.primary};
                            min-height: 30vh; /* Minimum 10 lines of text */
                            max-height: 80vh; /* Match the height of the Ile code textarea */
                            margin: 0;
                        `}>
                            {output}
                    </pre>
                </div>
            </div>

            {/* Output area - below both on desktop, second on mobile */}
            <div css={css`
                flex: 1;
                display: flex;
                flex-direction: column;
            `}>
                <div css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `}>
                    <h3>Program output</h3>
                </div>
                <pre css={css`
                    flex: 1;
                    font-family: monospace;
                    font-size: 14px;
                    padding: 12px;
                    border: 1px solid ${theme.palette.divider};
                    border-radius: 4px;
                    overflow: scroll;
                    min-height: 10vh; /* Minimum 10 lines of text */
                    max-height: 30vh;
                    white-space: pre-wrap;
                    background-color: ${theme.palette.background.paper};
                    color: ${theme.palette.text.primary};
                `}>
                    {goOutput}
                </pre>
            </div>

            {/* Snackbar notification for copy success */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{width: '100%'}}
                >
                    Link copied to clipboard!
                </Alert>
            </Snackbar>
        </div>
    );
};

function ileCompile(program: string): ({ error: string } | { types: string, goOutput: string }) {
    try {

        // @ts-ignore
        return window.CompileAndShowGoOutput(program);
    } catch (error) {
        return {error: `Compilation error: ${error}`};
    }
}
