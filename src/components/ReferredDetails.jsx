import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const ReferredDetails = () => {
  const { phone } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [winAmount, setWinningAmount] = useState(0);
  const [looseAmount, setLosingAmount] = useState(0);
  const [refAmount, setRefAmount] = useState(0);
  const [groupedTransactions, setGroupedTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://ajayLuckyBrust.today/wallet/getReferred?phone=${phone}`);
      const transactions = response.data.referred;
      console.log(transactions);

      const grouped = transactions.reduce((acc, transaction) => {
        const userId = transaction.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            totalAmount: 0,
            totalDeposit: 0,
            totalWithdraw: 0,
            avatar: transaction.avatar,
            date: moment(transaction.createdAt).format('YYYY-MM-DD'),
            time: moment(transaction.createdAt).format('HH:mm:ss')
          };
        }
        acc[userId].totalAmount += transaction.amount;
        acc[userId].totalDeposit += transaction.deposit_amount || 0;
        acc[userId].totalWithdraw += transaction.withdraw_amount || 0;
        return acc;
      }, {});

      const aggregatedTransactions = Object.values(grouped);

      const refAmount = aggregatedTransactions.reduce((acc, transaction) => acc + transaction.totalAmount, 0);
      setRefAmount(refAmount.toFixed(2));

      const winAmount = aggregatedTransactions.reduce((acc, transaction) => acc + transaction.totalDeposit, 0);
      const looseAmount = aggregatedTransactions.reduce((acc, transaction) => acc + transaction.totalWithdraw, 0);

      setTransactions(transactions);
      setGroupedTransactions(aggregatedTransactions);
      setWinningAmount(winAmount);
      setLosingAmount(looseAmount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }
    fetchData();
  }, []);  // Empty dependency array, runs only once on mount

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const columns = [
    { field: 'user_id', headerName: 'User ID', width: 300 },
    { field: 'totalAmount', headerName: 'Total Earn by Refer', width: 300 },
    { field: 'totalDeposit', headerName: 'Total Deposit', width: 300 },
    { field: 'totalWithdraw', headerName: 'Total Withdraw', width: 300 },
    { field: 'date', headerName: 'Date', width: 300 },
    { field: 'time', headerName: 'Time', width: 300 }
  ];

  const linkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
    color: 'black',
    background: '#DADADA'
  };

  linkStyle[':hover'] = {
    color: '#007bff',
  };

  return (
    <div>
      {/* Header with Sidebar Button */}
      <header
        style={{
          textAlign: 'center',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          background: '#F1F1F1',
          color: 'black'
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ marginLeft: '6in' }}>
          <h2 style={{ color: 'black' }}>History of Users Transactions</h2>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div style={{ width: '250px', padding: '20px', background: '#DADADA' }}>
          {/* List of links in the drawer */}
          <Link to="/" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Transactions</Link>
          <Link to="/pending" onClick={() => setDrawerOpen(false)} style={linkStyle}>Pending Withdrawal Requests</Link>
          <Link to="/approved" onClick={() => setDrawerOpen(false)} style={linkStyle}>Approved Transactions</Link>
          <Link to="/users" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Users</Link>
          <Link to="/lastUsers" onClick={() => setDrawerOpen(false)} style={linkStyle}>Last 7 days Users</Link>
        </div>
      </Drawer>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px', background: '#F1F1F1' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Card sx={{ maxWidth: 275, background: 'white', color: 'black' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Deposit Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {winAmount}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: 300, background: 'white', color: 'black' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Withdraw Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {looseAmount}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 275, background: 'white', color: 'black' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Refer Earn Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {refAmount}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <DataGrid
          rows={groupedTransactions.filter(transaction => transaction.totalAmount > 0).map(transaction => ({
            id: transaction.user_id,
            user_id: transaction.user_id,
            totalAmount: transaction.totalAmount.toFixed(2),
            totalDeposit: transaction.totalDeposit.toFixed(2),
            totalWithdraw: transaction.totalWithdraw.toFixed(2),
            avatar: transaction.avatar,
            date: transaction.date,
            time: transaction.time,
          }))}
          columns={columns}
          pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
          })}
          sx={{
            '&.MuiDataGrid-root': {
              bgcolor: '#DADADA',
              color: 'black',
              borderColor: 'transparent',
            },
          }}
        />
      </div>

      <footer style={{ textAlign: 'center', padding: '10px', color: '#99E9FA', background: '#DADADA' }}>
        <p>&copy; 2024 baazi Maar</p>
      </footer>
    </div>
  );
};

export default ReferredDetails;
