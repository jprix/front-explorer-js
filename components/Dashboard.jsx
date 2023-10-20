import React, { useState, useEffect, useContext } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import { NetworksContext } from '../context/networksContexts';
import NetworkDashboard from './NetworksTable'; // Assuming you create a NetworkDashboard component
import IntegrationsDashboard from './IntegrationsTable'; // Assuming you create a IntegrationsDashboard component
import StatusDashboard from './ProviderStatus'; // Assuming you create a ProviderStatus componentimp

function Dashboard() {
  const {
    loadingNetworks,
    setLoadingNetworks,
    networks,
    getNetworks,
    message,
  } = useContext(NetworksContext);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        setLoadingNetworks(true);
        await getNetworks();
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingNetworks(false);
      }
    };

    fetchNetworks();
  }, []);

  if (loadingNetworks) {
    return <CircularProgress />;
  }

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return (
          <NetworkDashboard
            tab={tab}
            showTable={showTable}
            setShowTable={setShowTable}
            networks={networks}
            message={message}
            page={page}
            setPage={setPage}
          />
        );
      case 1:
        return (
          <IntegrationsDashboard
            tab={tab}
            networks={networks}
            page={page}
            setPage={setPage}
          />
        );
      case 2:
        return (
          <StatusDashboard
            tab={tab}
            networks={networks}
            page={page}
            setPage={setPage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Supported Networks" />
        <Tab label="Integrations" />
        <Tab label="Provider Status" />
      </Tabs>
      {renderTabContent()}
    </div>
  );
}

export default Dashboard;
