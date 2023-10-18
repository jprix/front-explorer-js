import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

import { NetworksContext } from '../context/networksContexts';

const GetDepositDetails = ({
  toAuthData,
  symbol,
  setChain,
  chain,
  formValues,
  handleInputChange,
  errorMessage,
  setType,
  type,
}) => {
  const { networks } = useContext(NetworksContext);

  const [chains, setChains] = useState([]);
  const [supportedTokens, setSupportedTokens] = useState([]);

  useEffect(() => {
    console.log('Setting type:', toAuthData?.accessToken?.brokerType);

    setType(toAuthData?.accessToken?.brokerType);
  }, [toAuthData]);

  useEffect(() => {
    const getSupportedTokensByType = (type) => {
      console.log('type', type, 'fetching supported tokens');
      const matchingIntegrations = networks.filter(
        (integration) => integration.type === 'robinhood'
      );
      let result = [];

      matchingIntegrations.forEach((integration) => {
        integration.networks.forEach((network) => {
          result = [...result, ...network.supportedTokens];
        });
      });
      const uniqueSupportedTokens = Array.from(new Set(result));
      console.log('uniqueSupportedTokens', uniqueSupportedTokens);
      setSupportedTokens(uniqueSupportedTokens);
    };

    getSupportedTokensByType(type);
  }, [toAuthData]); // include type and networks in the dependency array

  const getNetworkNamesBySymbol = (selectedSymbol) => {
    const supportedChains = new Set();

    networks.forEach((integration) => {
      integration.networks.forEach((network) => {
        if (network.supportedTokens.includes(selectedSymbol)) {
          const lowerCasedName =
            network.name.charAt(0).toLowerCase() + network.name.slice(1);

          supportedChains.add(lowerCasedName);
        }
      });
    });

    setChains(['', ...supportedChains]);
  };

  useEffect(() => {
    if (symbol) {
      getNetworkNamesBySymbol(symbol);
    }
  }, [symbol]);

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
                helperText="Where the funds will be sent to"
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="h6">Symbol</Typography>
              <Select
                required
                labelId="symbol-label"
                id="symbol"
                value={formValues.symbol}
                label="Symbol"
                onChange={(e) => handleInputChange('symbol', e.target.value)}
              >
                {supportedTokens.map((supportedTokens, index) => (
                  <MenuItem key={index} value={supportedTokens}>
                    {supportedTokens}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {chains.length ? (
              <FormControl fullWidth>
                <Typography variant="h6">Chain</Typography>
                <Select
                  required
                  id="chain"
                  value={chain.toLowerCase()}
                  onChange={(e) => {
                    setChain(e.target.value);
                  }}
                >
                  {chains.map((chains, index) => (
                    <MenuItem key={index} value={chains}>
                      {chains}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            {errorMessage !== '' ? <p> Preview Error: {errorMessage}</p> : ''}
            <Grid container justifyContent="flex-end" mt={2}></Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

GetDepositDetails.propTypes = {
  toAuthData: PropTypes?.object,
  setSymbol: PropTypes?.func,
  symbol: PropTypes?.string,
  setChain: PropTypes?.func,
  chain: PropTypes?.string,
  errorMessage: PropTypes?.string,
  setType: PropTypes?.func,
  type: PropTypes?.string,
  handleInputChange: PropTypes?.func,
  formValues: PropTypes?.object,
};

export default GetDepositDetails;
