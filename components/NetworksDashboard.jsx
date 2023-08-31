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
import { TableFooter, TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';

function NetworkDashboard() {
  const [tab, setTab] = useState(0);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [message, setMessage] = useState(''); // Use to store messages like "No records found" or "Error fetching data"
  const [page, setPage] = useState(0);
  const consumerId = '12345'

  useEffect(() => {
    if (consumerId) {
      setLoading(true);
      setMessage(''); // Reset the message each time you're about to fetch

      const fetchNetworks = async () => {
        try {
          const response = await fetch(`/api/networks`);

          if (!response.ok) {
            // If the server responded with an error, throw it so that it can be caught in the catch block
            throw new Error(data.error || 'Something went wrong');
          }

          const data = await response.json();

          if (response && response.length === 0) {
            setMessage('No records found.');
          } else {
            setNetworks(data.content.integrations);
          }
        } catch (error) {
          console.error('An error occurred:', error.message);
          setMessage('Error fetching data.'); // Set the error message here
        } finally {
          setLoading(false);
        }
      };

      fetchNetworks();
    }
  }, [consumerId]);

  
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Tabs value={tab}>
        <Tab label="Supported Networks" />
        {/* <Tab label="Reviews" /> */}
      </Tabs>
      {tab === 0 && message ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>{message}</div>
      ) : (
        renderTable(networks, [
            'Type',
            'Id',
            'Name',
            'Network Id',
            'Chain Id',
            'Supported Tokens',
          ], page, setPage)
          
      )}

    </div>
  );
}

function renderTable(rows, headers, page, setPage) {
    const rowsPerPage = 10;
  
    const handleChangePage = (event, newPage) => {
    setPage(newPage);
};

    

    const allNetworks = rows.flatMap(row => row.networks.map(network => ({ ...network, type: row.type })));
    const currentPageNetworks = allNetworks.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
      <div style={{ overflowX: 'auto' }}>
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
              {currentPageNetworks.map((network, index) => (
                <TableRow
                  key={network.id + '-' + index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  }}
                >
                  <TableCell>{network.type}</TableCell>
                  <TableCell>
                    <Link href={`/request/${network.id}`} passHref>
                      {network.id}
                    </Link>
                  </TableCell>
                  <TableCell>{network.name}</TableCell>
                  <TableCell>{network.id}</TableCell>
                  <TableCell>{network.chainId}</TableCell>
                  <TableCell>{network.supportedTokens.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  colSpan={6}
                  count={allNetworks.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    );
}


  

export default NetworkDashboard;