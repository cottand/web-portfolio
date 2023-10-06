import {createContext, FC, ReactNode, useContext, useMemo, useState} from "react";
import {createTheme, IconButton, ThemeProvider, useTheme} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = createContext({
    toggleColorMode: () => {
    }
});


export const ChangeColorButton: FC = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit" size={"large"}>
        {theme.palette.mode === 'dark' ? <Brightness4Icon fontSize={"large"}/> : <Brightness7Icon fontSize={"large"}/>}
    </IconButton>
}

export const ToggleColorMode = (props: { children: ReactNode }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () => {
            const commonOptions = {
                palette: {mode},
                shadows: ["none"],
                typography: {
                    fontSize: 15
                },
            }
            const specificOptions = mode === 'dark' ? {} : {
                palette: {
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
                },
            }
            //@ts-ignore
            return createTheme({...commonOptions, ...specificOptions})
        },
        [mode],
    );


    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}