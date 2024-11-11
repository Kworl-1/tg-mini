import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';  // Импортируем стили

function Home() {
  const [tRSG, setTRSG] = useState(0);
  const [boost, setBoost] = useState(1);

  // Получение данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      const telegram_id = await getTelegramId(); // Функция для получения telegram_id
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

  // Функция для получения telegram_id из WebAppUser
  const getTelegramId = async () => {
    return new Promise((resolve) => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;

        // Проверяем, инициализирован ли WebApp и доступен ли объект user
        if (tg.user && tg.user.id) {
          resolve(tg.user.id); // Возвращаем id пользователя
        } else {
          console.warn('Не удалось получить user.id');
          resolve(null);  // Если user или id не существует
        }
      } else {
        console.warn('Telegram WebApp не инициализирован');
        resolve(null);  // Если WebApp не инициализирован
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
    telegram_id.then(id => {
      if (id) {
        axios.post('http://localhost:3001/api/increment', {
          telegram_id: id,
          amount: boost
        }).catch((error) => {
          console.error('Ошибка при обновлении tRSG:', error);
        });
      } else {
        console.warn('Не удалось получить telegram_id для обновления tRSG');
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
