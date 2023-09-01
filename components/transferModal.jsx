import React, { useState, useEffect } from 'react';
import { Card, CardContent, DialogContent, FormControl, MenuItem, TextField, Select, Grid, Typography, Box, DialogTitle, Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import ConfigurePreviewForm from './ConfigurePreview';

const Step1 = ({ brokerAuthData, existingAuthData, onStepChange, setDepositAddress }) => {
    const [validAddress, setValidAddress] = useState(false);   
    const [symbol, setSymbol] = useState('ETH');
    const [chain, setChain] = useState('ethereum');
    const [loading, setLoading] = useState(false);
    const [destinationDetails, setDestinationDetails] = useState(null);

    useEffect(() => {
        if (existingAuthData.length > 1) {
            const toAuthData = existingAuthData.find(
                (authData) => authData.accessToken.brokerType !== brokerAuthData.accessToken.brokerType
            );
            if (toAuthData) {
                setDestinationDetails(toAuthData);
                console.log('toAuthData', toAuthData);
            } else {
                console.log('No matching object found.');
            }
        } else {
            console.log('only one object');
        }
    }, [existingAuthData, brokerAuthData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitting form');
    };

    const handleGetDepositAddress = async () => {
        setLoading(true); // Set loading to true before making the request
    
        const payload = {
          authToken: destinationDetails?.accessToken?.accountTokens[0]?.accessToken,
          type: destinationDetails?.accessToken?.brokerType,
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
            throw new Error(`Failed to Generate Address: ${generateAddress.statusText}`);
          }
    
          const response = await generateAddress.json();
          console.log('response', response);
          setDepositAddress(response.content);
          setValidAddress(true);
          
         onStepChange(2);
        } catch (error) {
          console.error('An error occurred:', error.message);
        } finally {
          setLoading(false); // Set loading back to false after the request is completed
         
      };

    }
      
  
    return (
      <div>
        <h2>Get Deposit Address</h2>
       
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
  
              <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                            <Typography variant="h6">Destination</Typography>
                            <TextField
                                required
                                id="destination"
                                value={destinationDetails?.accessToken?.brokerType || ''}
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
                    placeholder={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  >
                    <MenuItem value="ETH">ETH</MenuItem>
                    <MenuItem value="BTC">BTC</MenuItem>
                    <MenuItem value="LTC">LTC</MenuItem>
                    <MenuItem value="SOL">SOL</MenuItem>
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
                <Grid container justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetDepositAddress}
          disabled={loading} // Disable the button while loading is true
        >
          {loading ? 'Loading...' : 'Get Deposit Address'}
        </Button>
      </Grid>
  
  
  
  
                </form>
              </CardContent>
            </Card>
          {/* )} */}
        </div>
      );
    };
  
 
  
    const Step2 = ({ onBack, onStepChange, brokerAuthData, depositAddress }) => {
        console.log('step 2 depositAddress', depositAddress); // Moved outside of the return
        return (
          <div>
            <h2>Configure Transfer</h2>
            {depositAddress ? (
              <ConfigurePreviewForm brokerAuthData={brokerAuthData} depositAddress={depositAddress} />
            ) : (
              <div>Loading deposit address...</div>
            )}
      
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button variant="contained" color="primary" onClick={onBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={onStepChange}>
                Next
              </Button>
            </Box>
          </div>
        );
      };
      
  
  const Step3 = ({ onBack }) => (
    <div>
      <h2>Submit Transfer</h2>
      {/* Your final content here */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </div>
  );
  

  const TransferModal = ({ open, onClose, brokerAuthData, existingAuthData }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(1);
    const [depositAddress, setDepositAddress] = useState({});


    const handleStepChange = (step) => {
        setActiveStep(step);
      };
  
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div" color="secondary">
            Send Form
            </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
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
    />
  )}
  {activeStep === 2 && (
    <Step2
      brokerAuthData={brokerAuthData}
      depositAddress={depositAddress}
      onStepChange={() => handleStepChange(3)} 
    />
  )}
  {activeStep === 3 && (
    <Step3
      brokerAuthData={brokerAuthData}
    //   onStepChange={() => handleStepChange()} 
    />
  )}
</DialogContent>

    </Dialog>
      );
    };
  
  export default TransferModal;
