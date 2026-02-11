import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { darkTheme } from './theme';
import { AppRoutes } from './routes/AppRoutes';

import { AuthProvider } from './features/auth/context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <BrowserRouter>
        <AuthProvider>
           <AppRoutes />
        </AuthProvider>
      </BrowserRouter>

    </ThemeProvider>
  );
}

export default App;