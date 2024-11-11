import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';  // Импортируем стили

function Home() {
  const [tRSG, setTRSG] = useState(0);
  const [boost, setBoost] = useState(1);
  const [telegramId, setTelegramId] = useState(null);

  // Получение данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      const telegram_id = getTelegramId(); // Получаем telegram_id
      if (!telegram_id) return; // Проверка на случай, если ID не доступен
      try {
        const response = await axios.get('http://localhost:3001/api/user', {
          params: { telegram_id }
        });
        setTRSG(response.data.tRSG_amount);
        setBoost(response.data.farm_boost);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };
    fetchUserData();
  }, [telegramId]);

  // Функция для получения telegram_id из Web App
  const getTelegramId = () => {
      if (window.Telegram && window.Telegram.WebApp) {
          return window.Telegram.WebApp.initDataUnsafe.user.id;
      } else {
          console.warn('Telegram WebApp не доступен');
          return null;
      }
  };


  // Обработчик клика на изображение stoney
  const handleImageClick = () => {
    const imageElement = document.querySelector('.image');
    imageElement.classList.add('clicked');

    setTimeout(() => {
      imageElement.classList.remove('clicked');
    }, 100);

    // Обновление tRSG
    setTRSG(tRSG + boost);
    const telegram_id = telegramId || getTelegramId(); // Используем сохраненный или получаемый ID
    if (telegram_id) {
      axios.post('http://localhost:3001/api/increment', {
        telegram_id,
        amount: boost
      }).catch((error) => {
        console.error('Ошибка при обновлении tRSG:', error);
      });
    }
  };

  return (
    <div className="container">
      <h1>tRSG Farming</h1>
      
      {/* Стилизация меню через ссылки <a> */}
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
