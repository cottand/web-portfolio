/** @jsxImportSource @emotion/react */
import React, {useState, useEffect, useRef} from 'react';
import {css} from '@emotion/react';
import {useTheme, useMediaQuery} from '@mui/material';

// Import the loadGoWasm function
import {loadIleWasm} from '../../ile_wasm';

export const IleCompiler = () => {
    const [code, setCode] = useState<string>('package main\n// Type your Ile code here\n');
    const [output, setOutput] = useState<string>('');
    const [goOutput, setGoOutput] = useState<string>('');
    const [inputHeight, setInputHeight] = useState<number>(200); // Default min-height
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Load WASM when component mounts
    useEffect(() => {
        const initWasm = async () => {
            try {
                await loadIleWasm();
                handleCodeChange(code);
                // Run initial compilation
            } catch (error) {
                setOutput(`error initializing WebAssembly: ${error}`);
            }
        };

        initWasm();
    }, []);

    // Update input height when code changes or component updates
    useEffect(() => {
        if (inputRef.current) {
            // Get the scrollHeight of the textarea (content height)
            const scrollHeight = inputRef.current.scrollHeight;
            // Set the height to the max of 200px (10 lines) or the content height
            setInputHeight(Math.max(200, scrollHeight));
        }
    }, [code]);


    // Handle code changes and recompile on every keystroke
    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        try {
            const result = ileCompile(newCode);
            if ('error' in result) {
                setOutput(result.error);
                setGoOutput('');
                return;
            } else {
                setOutput(result.types);
                setGoOutput(result.goOutput);
            }
        } catch (error) {
            setOutput(`Runtime error: ${error}`);
        }
    };

    return (
        <div css={css`
            display: flex;
            flex-direction: column;
            height: 80vh;
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
                    <h3>Ile Code</h3>
                    <textarea
                        ref={inputRef}
                        value={code}
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
                            min-height: 200px; /* Approximately 10 lines of text */
                            height: ${inputHeight}px; /* Dynamic height based on content */
                        `}
                    />
                </div>

                {/* Go Output area - next to input on desktop, third on mobile */}
                {!isMobile && (
                    <div css={css`
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    `}>
                        <h3>Go Output</h3>
                        <pre css={css`
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
                            min-height: 200px; /* Minimum 10 lines of text */
                            height: ${inputHeight}px; /* Match the height of the Ile code textarea */
                        `}>
                            {goOutput}
                        </pre>
                    </div>
                )}
            </div>

            {/* Output area - below both on desktop, second on mobile */}
            <div css={css`
                flex: 1;
                display: flex;
                flex-direction: column;
            `}>
                <h3>Output</h3>
                <pre css={css`
                    flex: 1;
                    font-family: monospace;
                    font-size: 14px;
                    padding: 12px;
                    border: 1px solid ${theme.palette.divider};
                    border-radius: 4px;
                    overflow: scroll;
                    min-height: 200px; /* Minimum 10 lines of text */
                    max-height: 500px;
                    white-space: pre-wrap;
                    background-color: ${theme.palette.background.paper};
                    color: ${theme.palette.text.primary};
                `}>
                    {output}
                </pre>
            </div>

            {/* Go Output area on mobile only - third position */}
            {isMobile && (
                <div css={css`
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                `}>
                    <h3>Go Output</h3>
                    <pre css={css`
                        flex: 1;
                        font-family: monospace;
                        font-size: 14px;
                        padding: 12px;
                        border: 1px solid ${theme.palette.divider};
                        border-radius: 4px;
                        overflow: scroll;
                        white-space: pre-wrap;
                        background-color: ${theme.palette.background.paper};
                        color: ${theme.palette.text.primary};
                        height: ${inputHeight}px; /* Match the height of the Ile code textarea */
                    `}>
                        {goOutput}
                    </pre>
                </div>
            )}
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
