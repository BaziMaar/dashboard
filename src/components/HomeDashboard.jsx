import { useEffect } from 'react';
import './Dashboard.css'; // You can create a separate CSS file for styling
import Header from './Header';
import { useState } from 'react';
import { styled } from '@mui/system';
import { lightBlue } from '@mui/material/colors';
import axios from 'axios'
import moment from 'moment';

const getShadowColor = (gradient) => {
  // Assuming gradient format is linear-gradient(angle, color1, color2)
  const colors = gradient.match(/#[0-9a-f]{6}/gi);
  if (colors && colors.length >= 2) {
    // Taking the first color from the gradient as the shadow color
    return colors[0];
  } else {
    // Default shadow color
    return 'rgba(0, 0, 0, 0.1)';
  }
};

const White3DCard = styled('div')({
  background: 'linear-gradient(135deg, #4ECDC4, #f0f0f0)',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)',
});

const StyledCard = styled('div')(({ gradient }) => ({
  background: gradient,
  borderRadius: '10px',
  padding: '20px',
  boxShadow: `0 4px 8px ${getShadowColor(gradient)}, 0 6px 20px ${getShadowColor(gradient)}`,
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  color: 'lightblue',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Home = () => {
  // Mock data for number of users
  const [totalUsers, setTotalUsers] = useState(0);
  const [dailyUsers, setDailyUsers] = useState(0);
  const [weeklyUsers, setWeeklyUsers] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [todayDeposit, setTodayDeposit] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [todayWithdrawal, setTodayWithdrawal] = useState(0);
  const [weeklyDeposit, setWeeklyDeposit] = useState(0);
  const [weeklyWithdrawl, setWeeklyWithdrawl] = useState(0);



  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://ajayLuckyBrust.today/user/getUser`);
      const users = response.data.total;
      const todayUser=response.data.todayUserCount
      const weekUser=response.data.weekUserCount
  
      // Set total users
      setTotalUsers(users);

      // const todayFormatted = moment().format('YYYY-MM-DD');
      // const startOfWeek = moment().startOf('week');
      // const startOfWeekFormatted = moment().startOf('week').format('YYYY-MM-DD');
      // console.log(startOfWeekFormatted)
      // // Calculate daily and weekly user counts
      // const dailyUsersCount = users.filter(user => moment(user.createdAt).format('YYYY-MM-DD')===todayFormatted).length
      // const weeklyUsersCount = users.filter(user => moment(user.createdAt).format('YYYY-MM-DD')>=startOfWeekFormatted).length;
      // console.log(weeklyUsersCount)
  
      // Optionally log results for debugging
      // console.log('Daily Users Count:', dailyUsersCount);
      // console.log('Weekly Users Count:', weeklyUsersCount);
      setDailyUsers(todayUser)
      setWeeklyUsers(weekUser)
    } catch (error) {
      // Handle errors, for example:
      console.error('Error fetching user data:', error);
      // Or show an alert
      alert('Error fetching user data. Please try again later.');
    }
  };
  
  const fetchTrans = async () => {
    try {
      const response = await axios.get(`https://ajayLuckyBrust.today/wallet/getTrans`);
      const users = response.data.wallets;
      console.log(users)
      const todayFormatted = moment().format('YYYY-MM-DD');
      const startOfWeekFormatted = moment().startOf('week').format('YYYY-MM-DD');

      let totalDep = 0;
      let todayDep = 0;
      let totalWith = 0;
      let todayWith = 0;
      let weeklyDep=0;
      let weeklyWith=0;
      const today = moment().startOf('day');

      users.forEach(user => {
        if (Array.isArray(user.walletTrans)) {
          user.walletTrans.forEach(transaction => {
            let amount = parseFloat(transaction.amount);
            const transactionDate = moment(transaction.time);

            if (amount > 0) {
              totalDep += amount;
              if (todayFormatted==moment(transaction.time).format('YYYY-MM-DD')&&(transaction.status==0||transaction.status==1)) {
                todayDep += amount;
              }
              if(moment(transaction.time).format('YYYY-MM-DD')>=startOfWeekFormatted&&(transaction.status==0||transaction.status==1)){
                weeklyDep+=amount
              }
            } else if (amount < 0) {
              totalWith += Math.abs(amount);
              if (todayFormatted==moment(transaction.time).format('YYYY-MM-DD')&&(transaction.status==0||transaction.status==1)) {
                todayWith += Math.abs(amount);
              }
              if(moment(transaction.time).format('YYYY-MM-DD')>=startOfWeekFormatted&&(transaction.status==0||transaction.status==1)){
                weeklyWith+=Math.abs(amount)
              }
            }
          });
        }
      });
      setWeeklyDeposit(weeklyDep);
      setWeeklyWithdrawl(weeklyWith)
      setTotalDeposit(totalDep);
      setTodayDeposit(todayDep);
      setTotalWithdrawal(totalWith);
      setTodayWithdrawal(todayWith);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
      
    } 
    fetchUser();
    fetchTrans();
  }, []); // Empty dependency array to run only on component mount

  const goToCardWindow = (type) => {
    window.open(`/${type}`)
  }

  return (
    <>
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f0f0f0', color: '#333' }}>
      <Header />
      <div style={{ position: 'relative', zIndex: 1}}>
        <White3DCard style={{background: '#081A30', borderRadius:'0px'}}>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: 'lightblue' }}>
            <h2>Total Stats</h2>
          </div>
          <div className="dashboard" >
            <StyledCard   onClick={() => goToCardWindow('users')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Total Users</h2>
              <p>Total : {totalUsers}</p>
              <p>Users from Sunday: {weeklyUsers}</p>
              <p>Today Users: {dailyUsers}</p>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('transaction')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>All Transactions</h2>
              <p>Total Deposit: {totalDeposit}</p>
              <p>Total Withdrawl: {totalWithdrawal}</p>
              <p>Today Deposit: {todayDeposit}</p>
              <p>Total Withdrawl: {todayWithdrawal}</p>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow("week")} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Weekly Transactions</h2>
              <p>Weekly Deposit: {weeklyDeposit}</p>
              <p>Weekly Withdrawal: {weeklyWithdrawl}</p>
            </StyledCard>
            <StyledCard onClick={() =>goToCardWindow("weeklyUsers")} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Weekly Users</h2>
              <p>Users from Sunday: {weeklyUsers}</p>
            </StyledCard>
            <StyledCard   onClick={() => goToCardWindow('upi')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>UPI</h2>
              <p>all UPI : 3</p>
              </StyledCard>
              <StyledCard   onClick={() => goToCardWindow('level')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Level</h2>
              <p>all Level : 3</p>
              </StyledCard>

          </div>

          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: '#333' }}>
            
          </div>
          <div className="dashboard">
          <StyledCard   onClick={() => goToCardWindow('banner')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Banner</h2>
              <p>all Banner : 2</p>
              </StyledCard>
            <StyledCard onClick={() => goToCardWindow('approved')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Approved Transaction</h2>
              <p>Total : {totalUsers}</p>
              <p>Weekly Users: {weeklyUsers}</p>
              <p>Daily Users: {dailyUsers}</p>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('pending')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Pending Transactions Requests</h2>
              <p>Total Deposit: {totalDeposit}</p>
              <p>Weekly Deposit: {weeklyDeposit}</p>
              <p>Today Deposit: {todayDeposit}</p>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('daily')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Daily</h2>
              <p>Daily Deposit: {todayDeposit}</p>
              <p>Daily Withdrawal: {todayWithdrawal}</p>
            </StyledCard>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: '#333' }}>  
          </div>
          <div className="dashboard">
            <StyledCard onClick={() => goToCardWindow('deposit')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Deposit Transaction</h2>
              <p>Total Deposit: {totalDeposit}</p>
              <p>Weekly Deposit: {weeklyDeposit}</p>
              <p>Today Deposit: {todayDeposit}</p>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow("withdraw")} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Withdraw Transactions</h2>
              <p>Total Withdrawal: {totalWithdrawal}</p>
              <p>Weekly Withdrawal: {weeklyWithdrawl}</p>
              <p>Today Withdrawal: {todayWithdrawal}</p>
            </StyledCard>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: 'lightblue' }}>
            <h2>Aviator</h2>
          </div>
          <div className="dashboard">
            <StyledCard onClick={() => goToCardWindow('winAviatorEntry')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Winning Bets</h2>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('aviatorEntry')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Bet Placed</h2>

            </StyledCard>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: 'lightblue' }}>
            <h2>Mines</h2>
          </div>
          <div className="dashboard">
            <StyledCard onClick={() => goToCardWindow('users')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Main Dashboard</h2>
              <p>Total : {totalUsers}</p>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('products')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Bet Placed</h2>
            </StyledCard>
            <StyledCard onClick={() => console.log("Sub-Dealer clicked")} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Winning/Losing Bet</h2>
              <p>Total Winning: {totalUsers}</p>
              <p>Total Loosing: {dailyUsers}</p>
            </StyledCard>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: 'lightblue' }}>
            <h2>Spin</h2>
          </div>
          <div className="dashboard">
            <StyledCard onClick={() => goToCardWindow('main')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Main Dashboard</h2>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('spinEntry')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Bet Placed</h2>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('winSpinEntry')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2> Winning Bets</h2>
            </StyledCard>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: 'lightblue' }}>
            <h2>Dragon Tiger</h2>
          </div>
          <div className="dashboard">
            <StyledCard onClick={() => goToCardWindow('dragonTiger')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Main Dashboard</h2>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('dragonEntry')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Bet Placed</h2>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('winDragonEntry')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Winning Users Dragon Tiger</h2>

            </StyledCard>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 'large', paddingBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', color: 'lightblue' }}>
            <h2>Color Raja</h2>
          </div>
          <div className="dashboard">
            <StyledCard onClick={() => goToCardWindow('colorRaja')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Main Dashboard</h2>

            </StyledCard>
            <StyledCard onClick={() => goToCardWindow('colorEntry')} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2>Bet Placed</h2>
            </StyledCard>
            <StyledCard onClick={() => goToCardWindow("winColorEntry")} gradient="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">
              <h2> Winning Users Color Raja</h2>
            </StyledCard>
          </div>
        
        </White3DCard>
      </div>
      
      <footer style={{ position: 'absolute',marginTop:20, bottom: 0, left: 0, width: '100%', textAlign: 'center', background: '#fff', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)', color: '#A8FF7A'}}>@2024 - Flipkart Home Dashboard</footer>
    </div>
    </>
  );
};

export default Home;
