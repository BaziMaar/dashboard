import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BannerManager.css';

const BannerManager = () => {
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
      const response = await axios.get('https://ajayLuckyBrust.today/user/getBanner', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      setUpiList(response.data); // Assuming response.data.banners is the array of banner URLs
      setLoading(false);
    } catch (error) {
      console.error('Error fetching UPI list:', error);
      setError('Error fetching UPI list.');
      setLoading(false);
    }
  };

  const addUpi = async () => {
    try {
      await axios.post('https://ajayLuckyBrust.today/user/postBanner', 
        { banner: newUpi },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      alert(`${newUpi} new banner added successfully`);
      setNewUpi('');
      fetchUpiList(); // Re-fetch the list to include the new banner
    } catch (error) {
      console.error('Error adding Banner:', error);
      setError('Error adding Banner.');
    }
  };

  const deleteUpi = async (upiToDelete) => {
    try {
      await axios.post('https://ajayLuckyBrust.today/user/removeBanner', 
        { banner: upiToDelete },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      alert(`${upiToDelete} deleted successfully`);
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
      <h1>Banner Manager</h1>
      {error && <div className="error">{error}</div>}
      <div className="input-container">
        <input
          type="text"
          value={newUpi}
          onChange={(e) => setNewUpi(e.target.value)}
          placeholder="Enter new Banner Link"
        />
        <button onClick={addUpi}>Add Banner</button>
      </div>
      <div className="banner-list">
        {upiList.map((upi, index) => (
          <div key={index} className="banner-item">
            <img src={upi} alt={`Banner ${index + 1}`} />
            <button onClick={() => deleteUpi(upi)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerManager;
