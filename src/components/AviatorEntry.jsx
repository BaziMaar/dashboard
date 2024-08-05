import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Drawer,
  IconButton,
  CircularProgress,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import CrossIcon from '../assets/cross.svg';  // Assuming you have this asset

const AviatorEntry = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [activeColumn, setActiveColumn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortModel, setSortModel] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get('https://ajayLuckyBrust.today/api/getAviatorEntry');
      const sortedData = response.data.reverse();
      setTransactions(sortedData);
      setData(sortedData);

      const columns = [
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 150 },
        { field: 'time', headerName: 'Survive Time', width: 150 },
        { field: 'createdAt', headerName: 'Created At', width: 200 },
        { field: 'updatedAt', headerName: 'Updated At', width: 200 }
      ];

      setColumns(columns);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    

    fetchData();
  }, []);

  const handlePayment = async (phone, amount, status, id) => {
    setIsButtonDisabled(true);
    alert(`Making payment for phone ${phone} with amount ${amount} and status ${status}.`);
    try {
      await axios.post(`https://ajayLuckyBrust.today/wallet/updateStatus`, {
        phone,
        amount,
        status,
        id,
      });
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

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
    color: 'lightblue',
    ':hover': {
      color: '#007bff',
    },
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
        <IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer(true)} edge="start" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <div style={{ marginLeft: '6in' }}>
          <h2>Lucky Spin Bets</h2>
        </div>
      </header>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)} style={{ background: '#102339' }}>
        <div style={{ textAlign: 'left', padding: '10px', background: '#102339' }}>
          <img
            src={CrossIcon}
            alt="Hamburger Icon"
            style={{ width: '25px', height: '25px', cursor: 'pointer', background: 'white', borderRadius: '17px' }}
            onClick={toggleDrawer(false)}
          />
        </div>
        <div style={{ height: '100vh', width: '250px', padding: '20px', background: '#102339' }}>
          <Link to="/transaction" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            All Transactions
          </Link>
          <Link to="/pending" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Pending Requests
          </Link>
          <Link to="/approved" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Approved Transactions
          </Link>
          <Link to="/users" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            All Users
          </Link>
          <Link to="/weeklyUsers" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Weekly Users
          </Link>
          <Link to="/daily" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Daily Transactions
          </Link>
          <Link to="/week" onClick={() => setDrawerOpen(false)} style={linkStyle}>
            Weekly Transactions
          </Link>
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
            headerName: <CustomHeaderCell column={column} />,
          }))}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          getRowId={(row) => row._id}
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
            '& .MuiDataGrid-cell, & .MuiDataGrid-colCellTitle': {
              background: '#102339',
            },
            '.css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar': {
              color: 'lightblue',
            },
          }}
        />
      )}

      <footer style={{ backgroundColor: '#102339', color: 'lightblue', textAlign: 'center', padding: '10px' }}>
        <p>&copy; 2024 baazi Maar</p>
      </footer>
    </div>
  );
};

export default AviatorEntry;
