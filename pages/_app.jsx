// _app.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import TransferProvider from 'context/transferContext';
import NetworksProvider from 'context/networksContexts';

// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <NetworksProvider>
        <TransferProvider>
          <Component {...pageProps} />
        </TransferProvider>
      </NetworksProvider>
    </ThemeProvider>
  );
}
