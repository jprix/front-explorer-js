// _app.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
