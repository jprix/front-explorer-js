// _app.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import TransferProvider from 'context/transferContext';

// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <TransferProvider>
        <Component {...pageProps} />
      </TransferProvider>
    </ThemeProvider>
  );
}
