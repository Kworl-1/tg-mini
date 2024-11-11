import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';  // Импортируем стили

function Home() {
  const [tRSG, setTRSG] = useState(0);
  const [boost, setBoost] = useState(1);
  let tg = window.Telegram.WebApp;
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
        const telegram_id = tg.initDataUnsafe.user.id;
        Console.WriteLine(telegram_id)
        if (telegram_id) {
          resolve(telegram_id); // Возвращаем id пользователя
        } else {
          resolve(null);  // Если id не найден, возвращаем null
        }
      } else {
        resolve(null);  // Если Telegram не инициализирован, возвращаем null
      }
    });
  };

  // Обработчик клика на изображение
  const handleImageClick = () => {
    // Находим элемент изображения
    const imageElement = document.querySelector('.image');
    
    // Добавляем класс для анимации уменьшения размера
    imageElement.classList.add('clicked');

    // После 300 мс (время анимации) удаляем класс, чтобы вернуть изображение в исходное состояние
    setTimeout(() => {
      imageElement.classList.remove('clicked');
    }, 100);

    // Обновление tRSG
    setTRSG(tRSG + boost);
    const telegram_id = getTelegramId();
    axios.post('http://localhost:3001/api/increment', {
      telegram_id,
      amount: boost
    }).catch((error) => {
      console.error('Ошибка при обновлении tRSG:', error);
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
