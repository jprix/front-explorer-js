import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function TransferDashboard() {
  const [tab, setTab] = useState(0);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [message, setMessage] = useState(''); // Use to store messages like "No records found" or "Error fetching data"

  const consumerId = '12345'

  useEffect(() => {
    if (consumerId) {
      setLoading(true);
      setMessage(''); // Reset the message each time you're about to fetch

      const fetchTransfers = async () => {
        try {
          const response = {
            "content": {
              "transfers": [
                {
                  "id": "8E25ACB5-A9E2-4D00-8772-A255F010A2A9",
                  "status": "succeeded",
                  "type": "deposit",
                  "fromAddress": "D5PumQwt...",
                  "targetAddress": "D641Fmzx...",
                  "symbol": "DOGE",
                  "hash": "3310c6202aaeb44754a118ce11f255382d012060ade0d6d9f...",
                  "amount": 15,
                  "transactionAmount": 10,
                  "createdTimestamp": 1653215600,
                  "updatedTimestamp": 1653215600,
                  "networkTransactionFee": {
                    "amount": 5,
                    "symbol": "DOGE"
                  },
                  "confirmations": 17,
                  "blockchainMethod": "transfer"
                },
                {
                  "id": "70E6E3CF-5ACF-49C5-A4E1-5FB85A567F26",
                  "status": "succeeded",
                  "type": "withdrawal",
                  "fromAddress": "0x7BDE8361Fe587daD0e35448E754...",
                  "targetAddress": "0x83C8F28c26bF6aaca652Df1DbBE...",
                  "symbol": "ETH",
                  "hash": "0x77f3a280aa5cfe956a5759c24cf774325504070b32b4159...",
                  "amount": 0.1,
                  "transactionAmount": 0.099,
                  "createdTimestamp": 1653211113,
                  "updatedTimestamp": 1653211113,
                  "networkTransactionFee": {
                    "amount": 0.001,
                    "symbol": "ETH"
                  },
                  "confirmations": 18,
                  "blockchainMethod": "transfer"
                }
              ],
              "total": 2,
              "cursor": "N2VkZDI0MDMtNmRhYy01NThhLTk5NDUDYzI12M3GQ3ZmQ2",
              "earliestTimestamp": 1653211113
            },
            "status": "ok",
            "message": ""
          }
          
          // const data = await response.json();

          // if (!response.ok) {
          //   // If the server responded with an error, throw it so that it can be caught in the catch block
          //   throw new Error(data.error || 'Something went wrong');
          // }

          if (response && response.length === 0) {
            setMessage('No records found.');
          } else {
            setTransfers(response.content.transfers);
          }
        } catch (error) {
          console.error('An error occurred:', error.message);
          setMessage('Error fetching data.'); // Set the error message here
        } finally {
          setLoading(false);
        }
      };

      fetchTransfers();
    }
  }, [consumerId]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Transfers" />
        {/* <Tab label="Reviews" /> */}
      </Tabs>
      {tab === 0 && message ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>{message}</div>
      ) : (
        renderTable(transfers, [
          'ID',
          'Status',
          'Type',
          'From Address',
          'Target Address',
        ])
      )}

      {/* renderTable for tab 1 can remain as it was */}
    </div>
  );
}

function renderTable(rows, headers) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 950 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
              }}
            >
              <TableCell>
                <Link href={`/request/${row.id}`} passHref>
                  {row.id}
                </Link>
              </TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.fromAddress}</TableCell>
              <TableCell>{row.targetAddress}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransferDashboard;