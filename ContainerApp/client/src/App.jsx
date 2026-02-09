import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { HomePage } from "./pages/HomePage.jsx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
    background: {
      default: '#121019',
      paper: '#1e1b26',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;