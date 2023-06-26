import React, { useEffect, useState } from 'react';
import Home from './components/AdminPanel/Home';
import Login from './components/AdminPanel/Login';
import Header from './components/AdminPanel/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Header handleLogout={handleLogout} /> <Home />
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}
export default App;
