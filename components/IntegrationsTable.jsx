import React, { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { TableFooter, TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import { PropTypes } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function IntegrationsDashboard({ page, setPage }) {
  const [integrations, setIntegrations] = useState([]);
  const [showIntegrationsTable, setShowIntegrationsTable] = useState(false);
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoadingIntegrations(true);

        const response = await fetch('/api/integrations');

        if (!response.ok) {
          throw new Error('Failed to fetch integrations');
        }

        const data = await response.json();

        setIntegrations(data.content.integrations);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingIntegrations(false);
      }
    };

    fetchIntegrations();
  }, []);

  if (loadingIntegrations) {
    return <CircularProgress />;
  }

  const renderTable = (rows, headers) => {
    const rowsPerPage = 10;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const allIntegrations = rows.flatMap((row) =>
      row.networks.map((network) => ({
        ...network,
        type: row.type,
      }))
    );

    const currentPageIntegrations = allIntegrations.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

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
              {currentPageIntegrations.map((integration, index) => (
                <TableRow
                  key={integration?.id + '-' + index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor:
                      index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  }}
                >
                  <TableCell>{integration?.type}</TableCell>
                  <TableCell>{integration?.id}</TableCell>
                  <TableCell>{integration?.name}</TableCell>
                  <TableCell>{integration?.id}</TableCell>
                  <TableCell>{integration?.chainId}</TableCell>
                  <TableCell>
                    {integration?.supportedTokens.join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  colSpan={6}
                  count={allIntegrations.length}
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
  };

  return (
    <div>
      {!showIntegrationsTable ? (
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          size="small"
          onClick={() => setShowIntegrationsTable(true)}
        >
          Show Integrations Table
        </Button>
      ) : (
        renderTable(integrations, [
          'Type',
          'Id',
          'Name',
          'Network Id',
          'Chain Id',
          'Supported Tokens',
        ])
      )}
    </div>
  );
}

IntegrationsDashboard.propTypes = {
  tab: PropTypes?.number,
  showTable: PropTypes?.bool,
  setShowTable: PropTypes?.func,
  message: PropTypes?.string,
  page: PropTypes?.number,
  setPage: PropTypes?.func,
  setLoadingIntegrations: PropTypes?.func,
};

export default IntegrationsDashboard;
