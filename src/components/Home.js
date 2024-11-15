import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [tRSG, setTRSG] = useState(0);
  const [boost, setBoost] = useState(1);
  const [telegramId, setTelegramId] = useState(null); // Store Telegram ID in state
  const tg = window.Telegram.WebApp;

  useEffect(() => {
    tg.ready();
    console.log("Telegram Web App Initialized");

    // Add a slight delay to ensure Telegram data is loaded
    setTimeout(() => {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      console.log("initData:", initData); // Debug: check initData

      const telegram_id = initData?.user?.id;
      if (telegram_id) {
        setTelegramId(telegram_id); // Store Telegram ID in state
        fetchUserData(telegram_id);
      } else {
        console.warn("Unable to retrieve user ID.");
      }
    }, 500); // 500ms delay to ensure data is loaded
  }, []);

  const fetchUserData = async (telegram_id) => {
    try {
      const response = await axios.get('https://burro-distinct-implicitly.ngrok-free.app/api/user', {
        params: { telegram_id },
        headers: {
          'ngrok-skip-browser-warning': 'true', // Add header
        }
      });
      setTRSG(response.data.tRSG_amount);
      setBoost(response.data.farm_boost);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleImageClick = () => {
    if (tRSG >= 25000) {
      console.warn("The tRSG limit has been reached. Clicks are no longer counted.");
      tg.showAlert("You have reached the tRSG limit!");
      return; // Stop execution if the limit is reached
    }

    const imageElement = document.querySelector('.image');
    imageElement.classList.add('clicked');

    setTimeout(() => {
      imageElement.classList.remove('clicked');
    }, 100);

    // Increment tRSG
    setTRSG(tRSG + boost);

    if (telegramId) {
      axios.post(
        'https://burro-distinct-implicitly.ngrok-free.app/api/increment',
        {
          telegram_id: telegramId,
          amount: boost
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true' // Add header
          }
        }
      ).catch((error) => {
        console.error('Error updating tRSG:', error);
      });
    } else {
      console.error("Unable to retrieve telegram_id.");
    }
  };

  return (
    <div className="container">
      <h1>tRSG Farming</h1>

      <div className="menu">
        <a href="/">Home</a>
        <a href="/game">Game</a>
        <a href="/boost">Boost</a>
        <a href="/leaderboard">Leaderboard</a>
      </div>

      <div className="image-container">
        <img
          src="stoney.png"
          alt="Stoney"
          className="image"
          onClick={handleImageClick}
        />
        <div className="tRSG-container">
          <span className="tRSG-text">{tRSG}</span>
          <img src="rsg.png" alt="RSG Icon" className="tRSG-icon" />
        </div>
      </div>
    </div>
  );
}

export default Home;
