import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF9E57",
      light: "#ffc953",
    },
    secondary: {
      main: "#416393",
      light: "#7190c4",
    },
    add: {
      main: "#416393",
      dark: "#073965",
      contrastText: "#fff"
    },
    save: {
      main: "#6fbf73",
      dark: "#3e8e46",
      contrastText: "#fff"
    },
    cancel: {
      main: "#D9534F",
      dark: "#a21e27",
      contrastText: "#fff"
    }
  },
  typography: {
    fontFamily: "Ubuntu,Kanit"
  }
});

ReactDOM.render(
  <>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
