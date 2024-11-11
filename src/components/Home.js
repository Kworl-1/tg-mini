import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';  // Импортируем стили

function Home() {
  const [tRSG, setTRSG] = useState(0);
  const [boost, setBoost] = useState(1);
  
  // Получение данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      // Ждем, чтобы данные Telegram были загружены
      const telegram_id = await getTelegramId();
      if (telegram_id) {
        try {
          const response = await axios.get('http://localhost:3001/api/user', {
            params: { telegram_id }
          });
          setTRSG(response.data.tRSG_amount);
          setBoost(response.data.farm_boost);
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
        }
      } else {
        console.warn('Не удалось получить id пользователя. Проверьте, авторизован ли пользователь.');
      }
    };

    fetchUserData();
  }, []);

  // Функция для получения telegram_id из Web App
  const getTelegramId = async () => {
    return new Promise((resolve) => {
      // Проверяем, что Telegram Web App был инициализирован
      if (window.Telegram && window.Telegram.WebApp) {
        // Делаем это асинхронно
        const telegram_id = window.Telegram.WebApp.initDataUnsafe?.user?.id;
        if (telegram_id) {
          resolve(telegram_id);
        } else {
          resolve(null);  // Если id не найден, возвращаем null
        }
      } else {
        resolve(null);  // Если Telegram не инициализирован, возвращаем null
      }
    });
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
