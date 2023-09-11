import React, { useState, createContext } from 'react';

const defaultState = {};

export const TransferContext = createContext(defaultState);

const TransferProvider = ({ children }) => {
  const [transferDetails, setTransferDetails] = useState([]);
  const [loading, setLoadingTransfers] = useState(true);
  const [message, setMessage] = useState('');

  const getTransferDetails = async (payload) => {
    try {
      setLoadingTransfers(true);
      const response = await fetch(`/api/transactions/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw an error if the server responded with a non-200 status code.
        setTransferDetails([]);
        setMessage(data.error || 'Something went wrong');
        throw new Error(data.error || 'Something went wrong', response.status);
      }
      if (response && data.content.total === 0) {
        setMessage('No records found.');
        setTransferDetails([]);
      } else {
        setTransferDetails(data.content.transactions);
      }
    } catch (error) {
      setMessage(error);
      console.log('this was the token error', error);
    } finally {
      setLoadingTransfers(false);
    }
  };

  const state = {
    loading,
    setLoadingTransfers,
    transferDetails,
    getTransferDetails,
    message,
  };

  return (
    <TransferContext.Provider value={state}>
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
