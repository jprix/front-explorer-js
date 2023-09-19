import React, { use, useState } from 'react';
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  TextField,
  Typography,
  Select,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/system';

const GetDepositDetails = ({
  toAuthData,
  setSymbol,
  symbol,
  setChain,
  chain,
  errorMessage,
}) => {
  console.log('error state', errorMessage);

  return (
    <div>
      <h2>Get {toAuthData?.accessToken?.brokerName} Deposit Address</h2>

      <Card
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mt: 2,
          gap: 2,
          p: 2,
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <form>
            <FormControl fullWidth>
              <Typography variant="h6">Destination</Typography>
              <TextField
                required
                id="destination"
                value={
                  toAuthData?.accessToken?.brokerName || 'No destination found'
                }
                disabled
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="h6">Symbol</Typography>
              <Select
                required
                labelId="symbol-label"
                id="symbol"
                value={symbol}
                label="Symbol"
                placeholder="eth"
                onChange={(e) => setSymbol(e.target.value)}
              >
                <MenuItem value="ETH">ETH</MenuItem>
                <MenuItem value="BTC">BTC</MenuItem>
                <MenuItem value="LTC">LTC</MenuItem>
                <MenuItem value="SOL">SOL</MenuItem>
                <MenuItem value="DOGE">DOGE</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="h6">Chain</Typography>
              <TextField
                required
                id="chain"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
              />
            </FormControl>
            {errorMessage !== '' ? <p> Preview Error: {errorMessage}</p> : ''}
            <Grid container justifyContent="flex-end" mt={2}></Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetDepositDetails;
