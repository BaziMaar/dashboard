import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LevelManager.css';

const LevelManager = () => {
  const [upiList, setUpiList] = useState([]);
  const [newUpi, setNewUpi] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoDt, setAutoDt] = useState('');
  const [autoSpin, setAutoSpin] = useState('');
  const [autoColor, setAutoColor] = useState('');
  const [level, setLevel] = useState('hard');
  const API_KEY = 'https://ajayLuckyBrust.today/user/getUser';

  useEffect(() => {
    fetchUpiList();
  }, []);

  useEffect(() => {
    determineLevel();
  }, [autoDt, autoSpin, autoColor]);

  const fetchUpiList = async () => {
    try {
      const response = await axios.get('https://ajayLuckyBrust.today/auto/get', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      console.log(response.data.latestEntry);
      const { auto_spin, auto_dt, auto_color } = response.data.latestEntry;
      setUpiList(response.data.latestEntry);
      setAutoSpin(auto_spin);
      setAutoDt(auto_dt);
      setAutoColor(auto_color);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching UPI list:', error);
      setError('Error fetching UPI list.');
      setLoading(false);
    }
  };

  const determineLevel = () => {
    const values = [autoSpin, autoDt, autoColor];
    const nonZeroCount = values.filter(value => value > 0).length;

    switch (nonZeroCount) {
      case 2:
        setLevel('medium');
        break;
      case 1:
        setLevel('easy');
        break;
      case 0:
        setLevel('hard');
        break;
      default:
        setLevel('hard');
    }
  };

  const addUpi = async () => {
    try {
      const response = await axios.post('https://ajayLuckyBrust.today/auto/update', 
        { auto: newUpi },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      alert(`${newUpi} new upi added successfully`);
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
      alert(`${upiToDelete} deleted successfully`);
      setUpiList(upiList.filter(upi => upi !== upiToDelete));
    } catch (error) {
      console.error('Error deleting UPI:', error);
      setError('Error deleting UPI.');
    }
  };

  const handleLevelClick = async (level,type) => {
    let autoSpin, autoColor, autoDt;
    if(type===0){
        autoSpin = level;
    }
    else if(type===1){
        autoColor=level;
    }
    else{
        autoDt=level
    }

    try {
      await axios.post('https://ajayLuckyBrust.today/auto/update', 
        { auto_spin: autoSpin, auto_color: autoColor, auto_dt: autoDt },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      setAutoDt(autoDt);
      setAutoSpin(autoSpin);
      setAutoColor(autoColor);
      setLevel(level);
    } catch (error) {
      console.error('Error updating level:', error);
      setError('Error updating level.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Level Manager</h1>
      {error && <div className="error">{error}</div>}
      <div className="fields-container">
        <div className="field">
          <label>Auto Spin: </label>
          <span>{autoSpin==0?'Hard':autoSpin==2?'Medium':'Easy'}</span>
          <button onClick={() => handleLevelClick(1,0)}>Easy</button>
          <button onClick={() => handleLevelClick(2,0)}>Medium</button>
          <button onClick={() => handleLevelClick(0,0)}>Hard</button>
        </div>
        <div className="field">
          <label>Auto Color: </label>
          <span>{autoColor==0?'Hard':autoColor==2?'Medium':'Easy'}</span>
          <button onClick={() => handleLevelClick(1,1)}>Easy</button>
          <button onClick={() => handleLevelClick(2,1)}>Medium</button>
          <button onClick={() => handleLevelClick(0,1)}>Hard</button>
        </div>
        <div className="field">
          <label>Auto DT: </label>
          <span>{autoDt==0?'Hard':autoDt==2?'Medium':'Easy'}</span>
          <button onClick={() => handleLevelClick(1,2)}>Easy</button>
          <button onClick={() => handleLevelClick(2,2)}>Medium</button>
          <button onClick={() => handleLevelClick(0,2)}>Hard</button>
        </div>
      </div>
      <div className="level-indicator" style={{ color: level === 'hard' ? 'red' : 'black' }}>
        <strong>Current Level: {level.charAt(0).toUpperCase() + level.slice(1)}</strong>
      </div>
    </div>
  );
};

export default LevelManager;
