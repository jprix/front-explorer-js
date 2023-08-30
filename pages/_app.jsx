// _app.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
