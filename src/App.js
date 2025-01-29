import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Voting from './pages/Voting';
import LeaderboardPage from './pages/LeaderboardPage';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <div className='app'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/voting' element={<Voting />} />
            <Route path='/leaderboard' element={<LeaderboardPage />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
