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
          setTimeout(() => {
              const telegram_id = getTelegramId();
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
          }, 1000); // Задержка в 1 секунду
      };
  
      fetchUserData();
  }, []);


  // Функция для получения telegram_id из Web App
  const getTelegramId = () => {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
          const user = window.Telegram.WebApp.initDataUnsafe.user;
          if (user && user.id) {
              return user.id;
          } else {
              console.warn('Не удалось получить id пользователя. Проверьте, авторизован ли пользователь.');
              return null; // Возвращаем null, если id не удалось получить
          }
      } else {
          console.warn('Telegram WebApp SDK не инициализирован.');
          return null; // Возвращаем null, если SDK Telegram не загружен
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
