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
  setMfaCode,
  mfaRequired,
  mfaCode,
}) => {
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
              disabled
              label="From Auth Token"
              value={formValues?.fromAuthToken}
              onChange={(e) => handleInputChange('mfaCode', e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              required
              disabled
              label="Preview ID"
              value={transferDetails?.content.previewResult?.previewId}
              onChange={(e) => handleInputChange('previewId', e.target.value)}
            />
            {errorMessage !== '' ? <p> Preview Error: {errorMessage}</p> : null}
          </FormControl>
          {mfaRequired ? (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                required
                label="Please enter your MFA code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
              {errorMessage !== '' ? (
                <p> Preview Error: {errorMessage}</p>
              ) : null}
            </FormControl>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
};

export default ExecuteTransfer;
