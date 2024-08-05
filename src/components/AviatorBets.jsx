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

const AviatorBets = () => {
  const { phone } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [winAmount, setWinningAmount] = useState(0);
  const [looseAmount, setLosingAmount] = useState(0);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://ajayLuckyBrust.today/api/getTrans?phone=${phone}`);
      const transactions = response.data.transactions;

      const sumWin = transactions.reduce((acc, transaction) => {
        if (transaction.amount > 0) {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);

      const sumLose = transactions.reduce((acc, transaction) => {
        if (transaction.amount < 0) {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);

      const data = transactions.map((transaction) => ({
        key: transaction._id,
        amount: transaction.amount,
        date: moment(transaction.createdAt).format('YYYY-MM-DD'),
        time: moment(transaction.createdAt).format('HH:mm:ss'),
        type: transaction.amount > 0 ? 'Deposit' : 'Withdraw',
      }));

      const columns = [
        { field: 'amount', headerName: 'Amount', width: 150 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'time', headerName: 'Time', width: 150 },
        { field: 'type', headerName: 'Type', width: 150 },
      ];

      setColumns(columns);
      setData(data);
      setWinningAmount(sumWin);
      setLosingAmount(sumLose);
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

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const linkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
    color: 'black',
    background: '#DADADA',
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
          color: 'black',
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
          <h2 style={{ color: 'black' }}>History of Aviator Bets</h2>
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
                Total Winning Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {winAmount}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: 300, background: 'white', color: 'black' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Loose Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {looseAmount}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.key}
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

      <footer style={{ textAlign: 'center', padding: '10px', color: '#99E9FA', background: '#DADADA' }}>
        <p>&copy; 2024 baazi Maar</p>
      </footer>
    </div>
  );
};

export default AviatorBets;
