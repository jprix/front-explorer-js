import React, { useState } from 'react';
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';

const ConfigurePreviewForm = ({
  brokerAuthData,
  formValues,
  toAuthData,
  depositAddress,
  onStepChange,
  setTransferDetails,
  handleInputChange,
  errorMessage,
}) => {
  console.log('formValues', formValues);
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <form>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ mb: 1, color: theme.palette.secondary.main }}
            >
              Sending From: {brokerAuthData?.accessToken?.brokerType}
            </Typography>
            <TextField
              required
              label="From Auth Token"
              value={formValues.fromAuthToken}
              onChange={(e) =>
                handleInputChange('fromAuthToken', e.target.value)
              }
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              required
              label="From Type"
              value={formValues.fromType}
              onChange={(e) => handleInputChange('fromType', e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ mb: 1, color: theme.palette.secondary.main }}
            >
              To your {toAuthData?.accessToken?.brokerName} account.{' '}
            </Typography>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="To Type"
              disabled
              value={toAuthData?.accessToken?.brokerName || ''}
              onChange={(e) => handleInputChange('toType', e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Destination Address"
              disabled
              value={depositAddress?.address || ''}
              onChange={(e) => handleInputChange('toAddress', e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Network ID"
              disabled
              value={depositAddress?.networkId || ''}
              onChange={(e) => handleInputChange('networkId', e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Transfer Details:{' '}
            </Typography>
            <TextField
              required
              label="Amount"
              value={formValues.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              required
              label="Fiat Currency"
              value={formValues.fiatCurrency}
              onChange={(e) =>
                handleInputChange('fiatCurrency', e.target.value)
              }
            />
          </FormControl>
          <p>{errorMessage}</p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfigurePreviewForm;
