import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  IconButton,
  Drawer,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CrossIcon from '../assets/cross.svg';

const WeeklyUsers = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [addMoney, setAddMoney] = useState(null);
  const [deductMoney, setDeductMoney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ajayLuckyBrust.today/user/getUser`);
        const startOfWeekFormatted = moment().startOf('week').format('YYYY-MM-DD');
        setTransactions(response.data.data);
        const weeklyUsersCount = response.data.data.filter(user => moment(user.createdAt).format('YYYY-MM-DD')>=startOfWeekFormatted)
        console.log(weeklyUsersCount)
        const formattedData = weeklyUsersCount.map((transaction) => ({
          id: transaction._id,
          name: transaction.name,
          phone: transaction.phone,
          email: transaction.email,
          wallet: transaction.wallet.toFixed(2),
          withdrawal_amount: Math.abs(transaction.withdrwarl_amount).toFixed(2),
          referred_wallet: Math.abs(transaction.referred_wallet).toFixed(2),
          created_at: moment(transaction.createdAt).format('YYYY-MM-DD'),
          referred_users: (transaction.refer_id).length,
        }));

        setData(formattedData);

        const tableColumns = [
          { field: 'name', headerName: 'Name', width: 200 },
          { field: 'phone', headerName: 'Phone', width: 220 },
          { field: 'email', headerName: 'Email', width: 250 },
          { field: 'wallet', headerName: 'Current Wallet Amount', width: 180 },
          { field: 'withdrawal_amount', headerName: 'Withdrawal Amount', width: 220 },
          
          { field: 'created_at', headerName: 'Created At', width: 180 },
          { field: 'referred_wallet', headerName: 'Referred Wallet', width: 220 },
          { field: 'referred_users', headerName: 'Total Refers', width: 200 },
          {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleOpenModal(params.row.phone)}>
                Action
              </Button>
            ),
          },
          {
            field: 'transactionsButton',
            headerName: 'Transactions',
            width: 150,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handlePayment(params.row.phone)}>
                Transactions
              </Button>
            ),
          },
          {
            field: 'refer',
            headerName: 'Refer Details',
            width: 150,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleRefer(params.row.phone)}>
                Refer Details
              </Button>
            ),
          },
          {
            field: 'betButton',
            headerName: 'Aviator Bet',
            width: 150,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleBet(params.row.phone)}>
                Bet
              </Button>
            ),
          },
          {
            field: 'dragonTigerBetButton',
            headerName: 'Dragon Tiger Bet',
            width: 150,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleDragonBet(params.row.phone)}>
                Bet
              </Button>
            ),
          },
          {
            field: 'colorRajaBetButton',
            headerName: 'Color Raja Bet',
            width: 150,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleBet(params.row.phone)}>
                Bet
              </Button>
            ),
          },
          {
            field: 'minesBetButton',
            headerName: 'Mines Bet',
            width: 150,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleBet(params.row.phone)}>
                Bet
              </Button>
            ),
          },
          {
            field: 'luckyBetButton',
            headerName: 'Lucky Bet',
            width: 150,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleLuckyBet(params.row.phone)}>
                Bet
              </Button>
            ),
          },
        ];

        setIsLoading(false);
        setColumns(tableColumns);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBet = (phone) => {
    window.open(`/aviatorBets/${phone}`, '_blank');
  };

  const handleLuckyBet = (phone) => {
    window.open(`/luckyBets/${phone}`, '_blank');
  };

  const handleDragonBet = (phone) => {
    window.open(`/dragonBets/${phone}`, '_blank');
  };

  const handleColorBet = (phone) => {
    window.open(`/colorBets/${phone}`, '_blank');
  };

  const handlePayment = (phone) => {
    window.open(`/history/${phone}`, '_blank');
  };
  const handleRefer = (phone) => {
    window.open(`/referred/${phone}`, '_blank');
  };

  const handleOpenModal = (phone) => {
    setOpenModal(true);
    setPhone(phone);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAddMoney('');
    setDeductMoney('');
  };

  const handleAddMoneyChange = (event) => {
    const value = event.target.value;
    setAddMoney(value !== '' ? parseInt(value, 10) : null);
  };

  const handleDeductMoneyChange = (event) => {
    const value = event.target.value;
    setDeductMoney(value !== '' ? parseInt(value, 10) : null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSubmit = async () => {
    try {
      let apiEndpoint;
      let requestData;

      if (addMoney !== null) {
        apiEndpoint = `https://ajayLuckyBrust.today/wallet/adminDeposit`;
        requestData = {
          phone,
          amount: addMoney,
        };
      } else if (deductMoney !== null) {
        apiEndpoint = `https://ajayLuckyBrust.today/wallet/adminWithdraw`;
        requestData = {
          phone,
          amount: deductMoney,
        };
      } else {
        return;
      }

      const response = await axios.post(apiEndpoint, requestData);
      console.log(response.data);

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'lightblue',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
  };

  linkStyle[':hover'] = {
    color: '#007bff',
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    item.phone.includes(searchInput) ||
    item.email.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#081A30', color: 'lightblue', minHeight: '100vh' }}>
      <header
        style={{
          backgroundColor: '#102339',
          color: 'lightblue',
          textAlign: 'center',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow
          zIndex: 1, // Ensure header is on top of other elements
        }}
      >
        <IconButton
          onClick={toggleDrawer(true)}
          edge="start"
          style={{ marginRight: '10px', color: 'lightblue' }}
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <h1 style={{ flex: 1 }}>Weekly User Dashboard</h1>
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          style={{
            backgroundColor: '#e91e63',
            color: 'white',
            borderRadius: '20px',
            padding: '8px 16px',
            fontWeight: 'bold',
          }}
        >
          Logout
        </Button>
      </header>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div style={{ textAlign: 'left', padding: '10px', background: '#102339' }}>
          <img
            src={CrossIcon}
            alt="Close Icon"
            style={{ width: '25px', height: '25px', cursor: 'pointer', background: 'white', borderRadius: '17px' }}
            onClick={toggleDrawer(false)}
          />
        </div>
        <div style={{ height: '100vh', width: '250px', padding: '20px', background: '#102339' }}>
          <Link to="/transaction" target="_blank" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            All Transactions
          </Link>
          <Link to="/pending" target="_blank" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Pending Requests
          </Link>
          <Link to="/approved" target="_blank" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Approved Transactions
          </Link>
          <Link to="/users" target="_blank" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            All Users
          </Link>
          <Link to="/weeklyUsers" target="_blank" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Weekly Users
          </Link>
          <Link to="/daily" target="_blank" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Daily Transactions
          </Link>
          <Link to="/week" target="_blank" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Weekly Transactions
          </Link>
        </div>
      </Drawer>

      <div style={{ padding: '20px' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchInput}
          onChange={handleSearchInputChange}
          style={{ marginBottom: '20px', width: '100%', background: '#fff', color: 'black' }}
        />
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <DataGrid
            style={{ background: 'lightblue', color: '#081A30' }}
            rows={filteredData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      )}

      <div style={{ padding: '20px' }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="wallet" fill="#8884d8" />
            <Bar dataKey="withdrawal_amount" fill="#82ca9d" />
            <Bar dataKey="referred_wallet" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal} style={{ background: '#081A30', color: 'lightblue' }}>
        <DialogTitle>Add/Deduct Money</DialogTitle>
        <DialogContent>
          <TextField
            label="Add Money"
            type="number"
            value={addMoney}
            onChange={handleAddMoneyChange}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Deduct Money"
            type="number"
            value={deductMoney}
            onChange={handleDeductMoneyChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WeeklyUsers;
