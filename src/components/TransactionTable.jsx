import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Drawer,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CrossIcon from '../assets/cross.svg';
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumn] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [activeColumn, setActiveColumn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const handleColumnHeaderClick = (column) => {
    setActiveColumn(column.field === activeColumn ? null : column.field);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const phoneAsString = String(transaction.phone);
    const searchQueryString = String(searchQuery);

    return phoneAsString.includes(searchQueryString);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ajayLuckyBrust.today/wallet/getTrans`);
        setTransactions(response.data.wallets);
        const data = response.data.wallets.reduce((acc, user) => {
          return [
            ...acc,
            ...user.walletTrans.map((transaction) => ({
              key: transaction._id,
              phone: user.phone,
              amount: Math.abs(transaction.amount).toFixed(2),
              amount_status: transaction.amount > 0 ? 'Deposit' : 'Withdraw',
              time: new Date(transaction.time).toLocaleString(),
              status: transaction.status === 0 ? 'Pending' : transaction.status == 1 ? 'Approved' : 'Reject',
              paymentId: transaction.paymentId,
              bankId: transaction.bankId,
              ifscCode: transaction.ifscCode,
            })),
          ];
        }, []);
        const sortedData = data.reverse();

        setData(sortedData);
        const columns = [
          { field: "phone", headerName: "Phone", width: 200, cellClassName: 'property' },
          { field: "amount", headerName: "Amount", width: 200, cellClassName: 'property' },
          { field: "amount_status", headerName: "Request Type", width: 200, cellClassName: 'property' },
          { field: "time", headerName: "Time", width: 200, cellClassName: 'property' },
          { field: "status", headerName: "Status", width: 200, cellClassName: 'property' },
          { field: "paymentId", headerName: "Payment Id", width: 200, cellClassName: 'property' },
          { field: "bankId", headerName: "Bank Id", width: 200, cellClassName: 'property' },
          { field: "ifscCode", headerName: "IFSC CODE", width: 200, cellClassName: 'property' },
          {
            field: 'accept', headerName: 'Accept', width: 150,
            renderCell: (params) => (
              <Button
                variant="contained"
                size="small"
                onClick={() => handlePayment(params.row.phone, params.row.amount, 1, params.row.key)}
                disabled={isButtonDisabled || params.row.status == 1 || params.row.status === 2}
              >
                Accept
              </Button>
            ),
          },
          {
            field: 'reject', headerName: 'Reject', width: 150,
            renderCell: (params) => (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleOpenRejectDialog(params.row)}
              >
                Reject
              </Button>
            ),
          },
        ];
        setIsLoading(false);
        setColumn(columns);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [sortModel, setSortModel] = useState([]);

  const handleSortModelChange = (newModel) => {
    setSortModel(newModel);
  };

  const renderSortIndicator = (field) => {
    const sortedColumn = sortModel.find((column) => column.field === field);
    if (sortedColumn) {
      return sortedColumn.sort === 'asc' ? '↑' : '↓';
    }
    return null;
  };

  const CustomHeaderCell = ({ column }) => (
    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
      {column.headerName}
      {renderSortIndicator(column.field)}
    </div>
  );

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const linkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
    backgroundColor: '#081A30',
    color: 'lightblue'
  };

  linkStyle[':hover'] = {
    color: '#007bff',
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://ajayLuckyBrust.today/wallet/pendingTrans`);
      setTransactions(response.data.wallets);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePayment = async (phone, amount, status, id) => {
    setIsButtonDisabled(true);
    await axios.get(`https://ajayLuckyBrust.today/wallet/getTrans`);

    await updateStatus(phone, amount, status, id);
  };

  const updateStatus = async (phone, amount, status, id) => {
    fetch(`https://ajayLuckyBrust.today/wallet/updateStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        amount: amount,
        status: status,
        id: id
      }),
    })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => console.error('Error updating status:', error));
  };

  const handleOpenRejectDialog = (transaction) => {
    setCurrentTransaction(transaction);
    setOpenRejectDialog(true);
  };

  const handleRejectSubmit = async () => {
    if (currentTransaction) {
      await handlePayment(currentTransaction.phone, currentTransaction.amount, 2, currentTransaction.key);
      await sendRejectNotification(currentTransaction.phone, rejectReason);
    }
    setOpenRejectDialog(false);
    setRejectReason('');
  };

  const sendRejectNotification = async (phone, message) => {
    try {

    const userDetails = await axios.get(`https://ajayLuckyBrust.today/user/getUser?search=${phone}`);
    const token=userDetails.data.data[0].token;
      const notifyApiEndpoint = `https://ajayLuckyBrust.today/notification/send`;
      const notifyData = {
        title:"Withdrawl Rejected from Bazimaar",
        token:token,
        body:message
      };

      const notifyResponse = await axios.post(notifyApiEndpoint, notifyData);
      console.log(notifyResponse.data);
    } catch (error) {
      console.error('Error sending reject notification:', error);
    }
  };

  return (
    <div>
      <header
        style={{
          backgroundColor: '#102339',
          color: 'lightblue',
          textAlign: 'center',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
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
        <div style={{ marginLeft: '6in' }}><h2>All Transactions</h2></div>
      </header>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <div style={{ textAlign: 'left', padding: '10px', background: '#102339', }}>
          <img src={CrossIcon} alt="Hamburger Icon" style={{ width: '25px', height: '25px', cursor: 'pointer', background: 'white', borderRadius: '17px' }} onClick={toggleDrawer(false)} />
        </div>
        <div style={{ height: '100vh', width: '250px', padding: '20px', background: '#102339' }}>
          <Link to="/transaction" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Transactions</Link>
          <Link to="/pending" onClick={() => setDrawerOpen(false)} style={linkStyle}>Pending Requests</Link>
          <Link to="/approved" onClick={() => setDrawerOpen(false)} style={linkStyle}>Approved Transactions</Link>
          <Link to="/users" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Users</Link>
          <Link to="/weeklyUsers" onClick={() => setDrawerOpen(false)} style={linkStyle}>Weekly Users</Link>
          <Link to="/daily" onClick={() => setDrawerOpen(false)} style={linkStyle}>Daily Transactions</Link>
          <Link to="/week" onClick={() => setDrawerOpen(false)} style={linkStyle}>Weekly Transactions</Link>
        </div>
      </Drawer>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', background: '#081A30' }}>
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          rows={data}
          columns={columns.map((column) => ({
            ...column,
            headerName: (
              <CustomHeaderCell column={column} />
            ),
          }))}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          components={{
            ColumnHeaderCell: ({ column }) => (
              <div onClick={() => handleColumnHeaderClick(column)}>
                {column.headerName}
                {renderSortIndicator(column.field)}
              </div>
            ),
          }}
          getRowId={(row) => row.key}
          pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 10,
            bottom: params.isLastVisible ? 0 : 10,
          })}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            '&.MuiDataGrid-root': {
              bgcolor: '#081A30',
              color: 'lightblue',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            '&.MuiDataGrid-filterIcon': {
              bgcolor: '#102339',
              color: 'lightblue',
              borderColor: 'transparent',
            },
            '& .MuiDataGrid-cell, & .MuiDataGrid-colCellTitle': {
              background: '#102339'
            },
            '.css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar': {
              color: 'lightblue'
            }
          }}
        />
      )}

      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Payment</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleRejectSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <footer
        style={{
          backgroundColor: '#102339',
          color: 'lightblue',
          textAlign: 'center',
          padding: '10px',
        }}
      >
        <p>&copy; 2024 baazi Maar</p>
      </footer>
    </div>
  );
};

export default TransactionTable;
