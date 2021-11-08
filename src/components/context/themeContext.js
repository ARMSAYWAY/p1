import React, { useState, useContext } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const ThemeContext = React.createContext({});

export function useThemeContext() {
    return useContext(ThemeContext);
}

const ThemeProviderContext = props => {
    const [theme, setTheme] = useState("light");

    const handleSetTheme = data => {
        setTheme(data);
    };
    const contextValue = {
        theme,
        handleSetTheme
    };

    const ProdThemes = createMuiTheme({
        palette: {
            type: theme,
            primary: {
                main: "#FF9E57",
                light: "#ffc953",
            },
            secondary: {
                main: "#416393",
                light: "#7190c4",
            },
            neutral: {
                main: "#5c6ac4"
            },
            secondary2: {
                main: "#16161A",
                light: "#7190c4",
            }

        },
        backgroundColor: "pink",
        typography: {
            fontFamily: " Ubuntu,Kanit "
        }

    });

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={ProdThemes}>{props.children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};
export { ThemeContext, ThemeProviderContext };