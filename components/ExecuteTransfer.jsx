import React from 'react';
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';
import PropTypes from 'prop-types';

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
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              required
              disabled
              label="Preview ID"
              value={transferDetails?.content.previewResult?.previewId}
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

ExecuteTransfer.propTypes = {
  brokerAuthData: PropTypes?.object,
  transferDetails: PropTypes?.object,
  formValues: PropTypes?.object,
  errorMessage: PropTypes?.string,
  setMfaCode: PropTypes?.func,
  mfaRequired: PropTypes?.bool,
  mfaCode: PropTypes?.string,
};

export default ExecuteTransfer;
