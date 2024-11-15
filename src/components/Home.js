import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [tRSG, setTRSG] = useState(0);
  const [boost, setBoost] = useState(1);
  const [telegramId, setTelegramId] = useState(null); // Сохраняем ID в состоянии
  const [canClick, setCanClick] = useState(true); // Новое состояние для отслеживания возможности клика
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
      const response = await axios.get('https://burro-distinct-implicitly.ngrok-free.app/api/user', {
        params: { telegram_id },
        headers: {
          'ngrok-skip-browser-warning': 'true',  // Добавляем заголовок
        }
      });
      setTRSG(response.data.tRSG_amount);
      setBoost(response.data.farm_boost);
      // Если tRSG больше или равно 25000, запрещаем кликать
      if (response.data.tRSG_amount >= 25000) {
        setCanClick(false);
      }
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  };

  const handleImageClick = () => {
    // Если кликать нельзя, выходим из функции
    if (!canClick) {
      return;
    }

    const imageElement = document.querySelector('.image');
    imageElement.classList.add('clicked');

    setTimeout(() => {
      imageElement.classList.remove('clicked');
    }, 100);

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
            'ngrok-skip-browser-warning': 'true'  // Добавляем заголовок
          }
        }
      ).catch((error) => {
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
          className={`image ${canClick ? '' : 'disabled'}`} // Добавляем класс disabled, если нельзя кликать
          onClick={handleImageClick}
        />
        <div className="tRSG-container">
          <span className="tRSG-text">{tRSG}</span>
          <img src="rsg.png" alt="RSG Icon" className="tRSG-icon" />
        </div>
      </div>

      {!canClick && <p>Вы достигли лимита tRSG и больше не можете кликать!</p>}
    </div>
  );
}

export default Home;
