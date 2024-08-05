import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import io from 'socket.io-client';
import axios from 'axios';

const CardContainer = ({ eventData, secondEvent }) => {
  const [timing, setTiming] = useState(0);
  const [number, setNumber] = useState(0);
  const [result, setResult] = useState('Waiting for result');
  const [globalNumber,setGlobalNumber]=useState(0);
  const [lastBets, setLastBets] = useState([]);
  const [lastGlobalNumbers, setLastGlobalNumbers] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }
    if (secondEvent) {
      setTiming(secondEvent.time);
      setNumber(secondEvent.number);
      setResult(secondEvent.result);
      setGlobalNumber(secondEvent.globalNumbers)
      setLastBets([
        secondEvent.l % 10, secondEvent.k % 10, secondEvent.j % 10, secondEvent.i % 10,
        secondEvent.h % 10, secondEvent.g % 10, secondEvent.f % 10, secondEvent.e % 10,
        secondEvent.d % 10, secondEvent.c % 10, secondEvent.b % 10, secondEvent.a % 10
      ]);
      setLastGlobalNumbers([
        secondEvent.l / 10, secondEvent.k / 10, secondEvent.j / 10, secondEvent.i / 10,
        secondEvent.h / 10, secondEvent.g / 10, secondEvent.f / 10, secondEvent.e / 10,
        secondEvent.d / 10, secondEvent.c / 10, secondEvent.b / 10, secondEvent.a / 10
      ]);

    }
  }, [secondEvent]);

  const { red = 0, green = 0, voilet = 0, zero = 0, one = 0, two = 0, three = 0, four = 0, five = 0, six = 0, seven = 0, eight = 0, nine = 0, small = 0, big = 0 } = eventData;

  const handleCardClick = async (bet) => {
    try {
      alert(`You have selected the ${bet} Number`)
      for(let i=0;i<=9;i++){
        if(i!==bet){
          let response = await axios.post('https://ajayLuckyBrust.today/color/sendColorMoney', {
          phone: 123456789,
          number: i,
          color: -1,
          size: -1,
          amount: 10000,
          globalNumber: secondEvent.globalNumber,
          deviceId:"1234"
        });
        console.log(response.data)
        }
        else{
          let response = await axios.post('https://ajayLuckyBrust.today/color/sendColorMoney', {
            phone: 123456789,
            number: i,
            color: -1,
            size: -1,
            amount: 10,
            globalNumber: secondEvent.globalNumber,
            deviceId:"1234"
          });
          console.log(response.data)
        }
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const cardStyle = {
    flex: '1',
    marginRight: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '0px',
    overflow: 'hidden'
  };
  const getBackgroundColor = (bet, number) => {
    if (bet === 0) {
      return 'linear-gradient(135deg, red, purple)';
    } else if (bet === 5) {
      return 'linear-gradient(135deg, green, purple)';
    } else if (bet % 2 === 0) {
      return 'red';
    } else {
      return 'green';
    }
  };

  return (
    <div style={{ background: '#081A30', color: 'lightblue' }}>
      <div style={{ marginTop: '0px', textAlign: 'center', background: '#081A30', color: 'lightblue' }}>
        <h2 style={{ color: 'lightblue', fontSize: '30px', marginBottom: '10px' }}>Color Raja Dashboard</h2>
        <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #2980B9, #6DD5FA)' }}>
          <CardContent>
          <p style={{ color: '#fff', fontSize: '23px', marginBottom: '10px', fontWeight: 'bold' }}>Global Number: {globalNumber}</p>
            <p style={{ color: '#fff', fontSize: '23px', marginBottom: '10px', fontWeight: 'bold' }}>Betting Time: {timing}</p>
            <p style={{ color: '#fff', fontSize: '23px', marginBottom: '10px', fontWeight: 'bold' }}>Result Time: {number}</p>
            <p style={{ color: '#fff', fontSize: '23px', marginBottom: '10px', fontWeight: 'bold' }}>Result: {result !== '' ? result : "Waiting for Result"}</p>
          </CardContent>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '20px' }}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(255, 99, 71, 0.3), rgba(255, 69, 0, 0.7))' }}>
            <CardContent>
              <h3 style={{ color: '#ff4500' }}>Red Card</h3>
              <p>Total Amount Bet Placed: {red / 2}.</p>
            </CardContent>
          </Card>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(173, 255, 47, 0.3), rgba(50, 205, 50, 0.7))' }}>
            <CardContent>
              <h3 style={{ color: '#32cd32' }}>Green Card</h3>
              <p>Total Amount Bet Placed: {green / 2}.</p>
            </CardContent>
          </Card>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.7))' }}>
            <CardContent>
              <h3 style={{ color: '#8a2be2' }}>Violet Card</h3>
              <p>Total Amount Bet Placed: {voilet / 2}</p>
            </CardContent>
          </Card>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '20px' }}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(135, 206, 235, 0.3), rgba(70, 130, 180, 0.7))' }}>
            <CardContent>
              <h3 style={{ color: '#4682b4' }}>Small Number</h3>
              <p style={{color:'#fff'}}>Total Amount Bet Placed: {small / 2}.</p>
            </CardContent>
          </Card>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.3), rgba(0, 191, 255, 0.7))' }}>
            <CardContent>
              <h3 style={{ color: '#00bfff' }}>Big Number</h3>
              <p>Total Amount Bet Placed: {big / 2}</p>
            </CardContent>
          </Card>
        </div>
        <Card style={{ ...cardStyle, marginTop: '20px', background: '#A8FF7A', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <h3 style={{ color: 'black', fontSize: '20px', marginBottom: '10px' }}>Placed Bets on Numbers to win them</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[zero, one, two, three, four, five, six, seven, eight, nine].map((amount, index) => (
                <Card key={index} onClick={() => handleCardClick(index)}style={{ ...cardStyle, width: '200px', margin: '10px', background: getBackgroundColor(index,index) }}>
                  <CardContent>
                    <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '10px' }}>{['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][index]}</h3>
                    <p style={{ color: '#fff',fontWeight:'bold', fontSize: '14px', marginBottom: '0' }}>{amount / 9}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card style={{ ...cardStyle, marginTop: '20px', background: '#A8FF7A', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
  <CardContent>
    <h3 style={{ color: 'black', fontSize: '20px', marginBottom: '10px' }}>Last Bets</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {lastBets.map((bet, index) => (
        <Card 
          key={index} 
          style={{ 
            ...cardStyle, 
            width: '200px', 
            margin: '10px', 
            background: getBackgroundColor(bet, lastGlobalNumbers[index]), 
            cursor: 'pointer' 
          }}
        >
          <CardContent>
            <h3 style={{ color: 'black', fontSize: '16px', marginBottom: '10px' }}>Last Bet {index === 0 ? '' : index}</h3>
            <p style={{ color: '#333', fontSize: '14px', marginBottom: '10px' }}>{lastGlobalNumbers[index]}</p>
            <p style={{ color: '#333', fontSize: '14px', marginBottom: '0' }}>{bet}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
};

const ColorRajaDashboard = () => {
  const [eventData, setEventData] = useState({});
  const [secondEvent, setSecondEvent] = useState(null);

  useEffect(() => {
    const socket = io('https://socket.ajayluckybrust.today');

    socket.on('colorPlaced', (data) => {
      console.log('Received data:', data);
      setEventData(data);
    });
    socket.on('colorBet', (data) => {
      console.log('Received data:', data);
      setSecondEvent(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#081A30' }}>
      <Header />
      <CardContainer eventData={eventData} secondEvent={secondEvent} />
      <Footer />
    </div>
  );
};

export default ColorRajaDashboard;
