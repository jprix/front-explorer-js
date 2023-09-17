import React, { useState } from 'react';
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';

const ExecuteTransfer = ({
  brokerAuthData,
  transferDetails,
  formValues,
  errorMessage,
}) => {
  const theme = useTheme();

  console.log('error state', errorMessage);

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
              disabled
              label="From Auth Token"
              value={formValues?.fromAuthToken}
              onChange={(e) =>
                handleInputChange('fromAuthToken', e.target.value)
              }
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              required
              disabled
              label="Preview ID"
              value={transferDetails?.previewResult?.previewId}
              onChange={(e) => handleInputChange('previewId', e.target.value)}
            />
            {errorMessage !== '' ? <p> Preview Error: {errorMessage}</p> : null}
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExecuteTransfer;
