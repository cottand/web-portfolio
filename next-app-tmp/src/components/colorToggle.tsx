import {createContext, FC, ReactNode, useContext, useMemo, useState} from "react";
import {createTheme, IconButton, ThemeProvider, useMediaQuery, useTheme} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = createContext({
    toggleColorMode: () => {
    }
});


export const ChangeColorButton: FC = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit" size={"medium"}>
        {theme.palette.mode === 'dark' ? <Brightness4Icon/> : <Brightness7Icon/>}
    </IconButton>
}
