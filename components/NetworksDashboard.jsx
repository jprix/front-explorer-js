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
            
             const response = 
             {
                  "content": {
                    "integrations": [
                        {
                            "type": "binanceInternational",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "AAVE",
                                        "UNI",
                                        "ARB",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "915f07a3-8a02-40f0-8f9d-b773b81c60a6",
                                    "name": "AvalancheX",
                                    "supportedTokens": [
                                        "AVAX"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ARB",
                                        "USDT",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "USDT",
                                        "USDC",
                                        "TRX"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "binanceInternationalDirect",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "MATIC",
                                        "AAVE",
                                        "UNI",
                                        "ARB",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "915f07a3-8a02-40f0-8f9d-b773b81c60a6",
                                    "name": "AvalancheX",
                                    "supportedTokens": [
                                        "AVAX"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ARB",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "USDT",
                                        "USDC",
                                        "TRX"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "binanceUs",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "AAVE",
                                        "UNI",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ARB",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "USDT",
                                        "USDC"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "bybit",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "MATIC",
                                        "AAVE",
                                        "UNI",
                                        "USDT",
                                        "USDC",
                                        "ETH",
                                        "PYUSD"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "915f07a3-8a02-40f0-8f9d-b773b81c60a6",
                                    "name": "AvalancheX",
                                    "supportedTokens": [
                                        "AVAX"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "coinbase",
                            "networks": [
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "MATIC",
                                        "AAVE",
                                        "UNI",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL"
                                    ]
                                },
                                {
                                    "id": "18fa36b0-88a8-43ca-83db-9a874e0a2288",
                                    "name": "Optimism",
                                    "chainId": "10",
                                    "supportedTokens": [
                                        "OP"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ARB"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "huobi",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "AAVE",
                                        "UNI",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "915f07a3-8a02-40f0-8f9d-b773b81c60a6",
                                    "name": "AvalancheX",
                                    "supportedTokens": [
                                        "AVAX"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ARB",
                                        "USDT",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "USDT",
                                        "USDC",
                                        "TRX"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "krakenDirect",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "AAVE",
                                        "UNI",
                                        "USDT",
                                        "USDC",
                                        "ETH",
                                        "PYUSD"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ARB",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "USDT",
                                        "USDC",
                                        "TRX"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "kuCoin",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "MATIC",
                                        "AAVE",
                                        "UNI",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "915f07a3-8a02-40f0-8f9d-b773b81c60a6",
                                    "name": "AvalancheX",
                                    "supportedTokens": [
                                        "AVAX"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ARB",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "USDT",
                                        "USDC",
                                        "TRX"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "okx",
                            "networks": [
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "AAVE",
                                        "UNI",
                                        "ARB",
                                        "USDT",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "915f07a3-8a02-40f0-8f9d-b773b81c60a6",
                                    "name": "AvalancheX",
                                    "supportedTokens": [
                                        "AVAX"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "USDT",
                                        "USDC",
                                        "TRX"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "robinhood",
                            "networks": [
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "AAVE",
                                        "UNI",
                                        "USDC",
                                        "ETH"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "USDC"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        },
                        {
                            "type": "deFiWallet",
                            "networks": [
                                {
                                    "id": "9cc3f8db-809a-4d06-a183-34a63a84aca8",
                                    "name": "Cardano",
                                    "supportedTokens": [
                                        "ADA"
                                    ]
                                },
                                {
                                    "id": "a34f2431-0ddd-4de4-bc22-4a8143287aeb",
                                    "name": "Arbitrum",
                                    "chainId": "42161",
                                    "supportedTokens": [
                                        "ETH",
                                        "ARB",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12",
                                    "name": "Polygon",
                                    "chainId": "137",
                                    "supportedTokens": [
                                        "MATIC",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "c5dc5d2e-68c1-4261-9a30-90b598738bf5",
                                    "name": "Tron",
                                    "chainId": "111",
                                    "supportedTokens": [
                                        "TRX",
                                        "USDT",
                                        "USDC"
                                    ]
                                },
                                {
                                    "id": "18fa36b0-88a8-43ca-83db-9a874e0a2288",
                                    "name": "Optimism",
                                    "chainId": "10",
                                    "supportedTokens": [
                                        "ETH",
                                        "OP"
                                    ]
                                },
                                {
                                    "id": "03dee5da-7398-428f-9ec2-ab41bcb271da",
                                    "name": "Bitcoin",
                                    "chainId": "0",
                                    "supportedTokens": [
                                        "BTC"
                                    ]
                                },
                                {
                                    "id": "915f07a3-8a02-40f0-8f9d-b773b81c60a6",
                                    "name": "AvalancheX",
                                    "supportedTokens": [
                                        "AVAX"
                                    ]
                                },
                                {
                                    "id": "e3c7fdd8-b1fc-4e51-85ae-bb276e075611",
                                    "name": "Ethereum",
                                    "chainId": "1",
                                    "supportedTokens": [
                                        "ETH",
                                        "MATIC",
                                        "AAVE",
                                        "UNI",
                                        "ARB",
                                        "USDT",
                                        "USDC",
                                        "PYUSD"
                                    ]
                                },
                                {
                                    "id": "0291810a-5947-424d-9a59-e88bb33e999d",
                                    "name": "Solana",
                                    "chainId": "101",
                                    "supportedTokens": [
                                        "SOL",
                                        "USDT",
                                        "USDC"
                                    ]
                                }
                            ],
                            "supportsOutgoingTransfers": true,
                            "supportsIncomingTransfers": true
                        }
                    ]
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
            setNetworks(response.content.integrations);
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