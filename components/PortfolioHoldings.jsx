import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const PortfolioHoldings = () => {
  const [portfolioHoldings, setPortfolioHoldings] = useState({});

  useEffect(() => {
    const payload = {
      UserId: '12345',
    };
    const fetchPortfolioHoldings = async () => {
      try {
        const response = await fetch(`/api/holdings/portfolio`);

        if (response.ok) {
          const data = await response.json();
          setPortfolioHoldings(data);
        } else {
          console.error('Failed to fetch portfolio holdings');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchPortfolioHoldings();
  }, []); // Add userId to the dependency array to re-fetch when it changes

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Portfolio Holdings:{' '}
          {portfolioHoldings?.content?.cryptocurrenciesValue}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PortfolioHoldings;
