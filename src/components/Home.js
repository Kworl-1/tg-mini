import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [tRSG, setTRSG] = useState(0);
  const [boost, setBoost] = useState(1);
  const [telegramId, setTelegramId] = useState(null); // Сохраняем ID в состоянии
  const tg = window.Telegram.WebApp;

  useEffect(() => {
    tg.ready();
    console.log("Telegram Web App Initialized");

    // Добавим небольшую задержку для проверки загрузки данных Telegram
    setTimeout(() => {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      console.log("initData:", initData); // Отладка: проверяем initData

      const telegram_id = initData?.user?.id;
      if (telegram_id) {
        setTelegramId(telegram_id); // Сохраняем ID в состоянии
        fetchUserData(telegram_id);
      } else {
        console.warn("Не удалось получить ID пользователя.");
      }
    }, 500); // Задержка в 500 мс, чтобы убедиться, что данные успели загрузиться
  }, []);

  const fetchUserData = async (telegram_id) => {
    try {
      const response = await axios.get('https://3e40-150-241-107-221.ngrok-free.app/api/user', {
        params: { telegram_id }
      });
      setTRSG(response.data.tRSG_amount);
      setBoost(response.data.farm_boost);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  };

  const handleImageClick = () => {
    const imageElement = document.querySelector('.image');
    imageElement.classList.add('clicked');

    setTimeout(() => {
      imageElement.classList.remove('clicked');
    }, 100);

    setTRSG(tRSG + boost);

    if (telegramId) {
      axios.post('https://3e40-150-241-107-221.ngrok-free.app/api/increment', {
        telegram_id: telegramId,
        amount: boost
      }).catch((error) => {
        console.error('Ошибка при обновлении tRSG:', error);
      });
    } else {
      console.error("Не удалось получить telegram_id.");
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
