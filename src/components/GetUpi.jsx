import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UPIManager.css';

const UPIManager = () => {
  const [upiList, setUpiList] = useState([]);
  const [newUpi, setNewUpi] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_KEY = 'your-api-key-here'; // Replace with your actual API key

  useEffect(() => {
    fetchUpiList();
  }, []);

  const fetchUpiList = async () => {
    try {
      const response = await axios.get('https://ajayLuckyBrust.today/user/getUPI', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      setUpiList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching UPI list:', error);
      setError('Error fetching UPI list.');
      setLoading(false);
    }
  };

  const addUpi = async () => {
    try {
      const response = await axios.post('https://ajayLuckyBrust.today/user/postUpi', 
        { upi: newUpi },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      alert(`${newUpi}  new upi added successfully`)
      setNewUpi('');
    } catch (error) {
      console.error('Error adding UPI:', error);
      setError('Error adding UPI.');
    }
  };

  const deleteUpi = async (upiToDelete) => {
    try {
      await axios.post('https://ajayLuckyBrust.today/user/removeUpi', 
        { upi: upiToDelete },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      alert(`${upiToDelete}  deleted successfully`)
      setUpiList(upiList.filter(upi => upi !== upiToDelete));
    } catch (error) {
      console.error('Error deleting UPI:', error);
      setError('Error deleting UPI.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>UPI Manager</h1>
      {error && <div className="error">{error}</div>}
      <div className="input-container">
        <input
          type="text"
          value={newUpi}
          onChange={(e) => setNewUpi(e.target.value)}
          placeholder="Enter new UPI"
        />
        <button onClick={addUpi}>Add UPI</button>
      </div>
      <ul>
        {upiList.map((upi, index) => (
          <li key={upi.id || index}>
            {upi}
            <button onClick={() => deleteUpi(upi)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UPIManager;
