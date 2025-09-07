import { RouterProvider } from "react-router-dom";
import { router } from "./lib/route/index.tsx";
import { ContextProvider } from "./context/context-provider.tsx";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryProvider } from "./lib/providers/query-provider.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: '#C8A846',
    },
    secondary: {
      main: '#897334',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const AppWrapper = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>
        <ContextProvider>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </ContextProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;


