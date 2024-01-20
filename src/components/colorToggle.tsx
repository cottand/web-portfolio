import {createContext, FC, ReactNode, useContext, useMemo, useState} from "react";
import {createTheme, Fade, IconButton, ThemeProvider, useMediaQuery, useTheme} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = createContext({
    toggleColorMode: () => {
    }
});


export const ChangeColorButton: FC = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    let weAreDark = theme.palette.mode === 'dark';
    return <IconButton sx={{ml: 1, mt: -0.09}} onClick={colorMode.toggleColorMode} color="primary" size={"small"}>
        {weAreDark ? <Brightness4Icon/> : <Brightness7Icon/>}
    </IconButton>
}

export const ToggleColorMode = (props: { children: ReactNode }) => {
    const resultOfMedia = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const initialMode = document.cookie === 'light' ? 'light' : (document.cookie === 'dark' ? 'dark' : resultOfMedia)
    const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = (prevMode === 'light' ? 'dark' : 'light')
                    document.cookie = newMode
                    return newMode
                });
            },
        }),
        [],
    );

    const theme = useMemo(
        () => {
            const commonOptions = {
                palette: {mode},
                typography: {
                    fontSize: 15
                },
                shadows: {}
            }
            const shadows = Array.apply(null, Array(25)).map((_, i) => [`${i}`, "none"])
            commonOptions.shadows = Object.fromEntries(shadows)
            const specificOptions = mode === 'dark' ?
                {} : {
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