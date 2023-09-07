import React, { useState, useEffect } from 'react';
import {
  DialogContent,
  Box,
  DialogTitle,
  Dialog,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import ConfigurePreviewForm from './ConfigurePreview';
import ExecuteTransfer from './ExecuteTransfer';
import GetDepositDetails from './DepositDetails';

const Step1 = ({
  brokerAuthData,
  existingAuthData,
  onStepChange,
  setDepositAddress,
  toAuthData,
  loading,
  depositAddress,
  handleGetDepositAddress,
  symbol,
  setSymbol,
  chain,
  setChain,
}) => {
  return (
    <div>
      {!depositAddress ? (
        <GetDepositDetails
          brokerAuthData={brokerAuthData}
          depositAddress={depositAddress}
          toAuthData={toAuthData}
          onStepChange={onStepChange}
          symbol={symbol}
          chain={chain}
          setChain={setChain}
          setSymbol={setSymbol}
        />
      ) : (
        <div>Loading deposit address...</div>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetDepositAddress}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Deposit details'}
        </Button>
      </Box>
    </div>
  );
};

const Step2 = ({
  onStepChange,
  brokerAuthData,
  depositAddress,
  toAuthData,
  setTransferDetails,
  handleExecutePreview,
  loading,
  formValues,
}) => {
  console.log(
    'step 2 depositAddress',
    depositAddress,
    'toAuthData: ',
    toAuthData
  );
  return (
    <div>
      <h2>Preview Transfer</h2>
      {!loading ? (
        <ConfigurePreviewForm
          brokerAuthData={brokerAuthData}
          depositAddress={depositAddress}
          toAuthData={toAuthData}
          onStepChange={onStepChange}
          setTransferDetails={setTransferDetails}
          handleExecutePreview={handleExecutePreview}
          formValues={formValues}
        />
      ) : (
        <div>Loading preview details...</div>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExecutePreview}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Execute Preview'}
        </Button>
      </Box>
    </div>
  );
};

const Step3 = ({
  transferDetails,
  brokerAuthData,
  depositAddress,
  handleExecuteTransfer,
  loading,
  formValues,
}) => (
  <div>
    <h2>Submit Transfer</h2>
    {transferDetails ? (
      <ExecuteTransfer
        brokerAuthData={brokerAuthData}
        depositAddress={depositAddress}
        transferDetails={transferDetails}
        formValues={formValues}
      />
    ) : (
      <div>Loading deposit address...</div>
    )}{' '}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExecuteTransfer}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Execute Transfer'}
      </Button>
    </Box>
  </div>
);

const TransferModal = ({
  open,
  onClose,
  brokerAuthData,
  existingAuthData,
  onStepChange,
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(1);
  const [depositAddress, setDepositAddress] = useState({});
  const [toAuthData, setToAuthData] = useState(null);
  const [transferDetails, setTransferDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const [validAddress, setValidAddress] = useState(false);
  const [symbol, setSymbol] = useState('ETH');
  const [chain, setChain] = useState('ethereum');
  console.log('toType', toAuthData?.accessToken?.brokerType);
  const [formValues, setFormValues] = useState({
    fromAuthToken: brokerAuthData?.accessToken?.accountTokens[0]?.accessToken,
    fromType: brokerAuthData?.accessToken?.brokerType,
    toType: toAuthData?.accessToken?.brokerType,
    networkId: depositAddress?.networkId,
    symbol: 'eth',
    toAddress: depositAddress?.address,
    amount: 0.001,
    fiatCurrency: 'USD',
  });

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useEffect(() => {
    if (existingAuthData.length > 1) {
      const destinationAuthData = existingAuthData.find(
        (authData) =>
          authData.accessToken.brokerType !==
          brokerAuthData.accessToken.brokerType
      );
      if (destinationAuthData) {
        setToAuthData(destinationAuthData);
        console.log('toAuthData', destinationAuthData);
      } else {
        console.log('No matching object found.');
      }
    } else {
      console.log('only one object');
    }
  }, [existingAuthData, brokerAuthData, toAuthData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submitting form');
  };

  const handleGetDepositAddress = async () => {
    setLoading(true);

    const payload = {
      authToken: toAuthData?.accessToken?.accountTokens[0]?.accessToken,
      type: toAuthData?.accessToken?.brokerType,
      symbol,
      chain,
    };

    try {
      const generateAddress = await fetch('/api/transfers/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!generateAddress.ok) {
        throw new Error(
          `Failed to Generate Address: ${generateAddress.statusText}`
        );
      }

      const response = await generateAddress.json();
      console.log('response', response);
      setDepositAddress(response.content);
      setValidAddress(true);

      handleStepChange(2);
    } catch (error) {
      console.error('An error occurred:', error.message);
    } finally {
      setLoading(false); // Set loading back to false after the request is completed
    }
  };

  const handleExecutePreview = async () => {
    setLoading(true);

    const payload = formValues;

    try {
      const executePreview = await fetch('/api/transfers/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!executePreview.ok) {
        console.log('executePreview', executePreview);
        throw new Error(
          `Failed to Execute Preview Address: ${executePreview.statusText}`
        );
      }

      const response = await executePreview.json();
      console.log('response', response);
      setTransferDetails(response.content);
      //   setValidAddress(true);

      handleStepChange(3);
    } catch (error) {
      console.error('An error occurred:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTransfer = async () => {
    setLoading(true);
    console.log('formValues', formValues);

    const payload = {
      fromAuthToken: brokerAuthData?.accessToken?.accountTokens[0]?.accessToken,
      fromType: brokerAuthData?.accessToken?.brokerType,
      previewId: transferDetails?.previewResult?.previewId,
      mfaCode: '6483355',
    };

    try {
      const executeTransfer = await fetch('/api/transfers/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!executeTransfer.ok) {
        console.log('executeTransfer', executeTransfer);
        throw new Error(
          `Failed to Execute Transfer: ${executeTransfer.statusText}`
        );
      }

      const response = await executeTransfer.json();
      console.log('response', response);
      if (response.content.status === 'mfaRequired') {
        console.log('mfaRequired');
        alert('mfaRequired.  Paste in code and resend');
      } else {
        alert(
          `Transfer Status: ${response.status}.  Here is your transferId: ${response.content.executeTransferResult.transferId}`
        );
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      networkId: depositAddress?.networkId,
      toAddress: depositAddress?.address,
    }));
  }, [depositAddress]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {activeStep === 1 && (
          <Step1
            brokerAuthData={brokerAuthData}
            existingAuthData={existingAuthData}
            onStepChange={() => handleStepChange(2)}
            setDepositAddress={setDepositAddress}
            handleGetDepositAddress={handleGetDepositAddress}
            setToAuthData={setToAuthData}
            loading={loading}
            toAuthData={toAuthData}
            symbol={symbol}
            setSymbol={setSymbol}
            chain={chain}
            setChain={setChain}
          />
        )}
        {activeStep === 2 && (
          <Step2
            brokerAuthData={brokerAuthData}
            depositAddress={depositAddress}
            toAuthData={toAuthData}
            onStepChange={() => handleStepChange(3)}
            setTransferDetails={setTransferDetails}
            handleExecutePreview={handleExecutePreview}
            formValues={formValues}
            handleInputChange={handleInputChange}
            loading={loading}
          />
        )}
        {activeStep === 3 && (
          <Step3
            brokerAuthData={brokerAuthData}
            depositAddress={depositAddress}
            toAuthData={toAuthData}
            transferDetails={transferDetails}
            handleExecuteTransfer={handleExecuteTransfer}
            formValues={formValues}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
