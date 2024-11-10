import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [tRSG, setTRSG] = useState(0);
    const [boost, setBoost] = useState(1);
    const [telegramId, setTelegramId] = useState(null);  // Состояние для хранения telegram_id

    // Получение данных пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            // Проверяем, если telegramId существует
            if (telegramId) {
                try {
                    const response = await axios.get('http://localhost:3001/api/user', {
                        params: { telegram_id: telegramId }
                    });
                    setTRSG(response.data.tRSG_amount);
                    setBoost(response.data.farm_boots);
                } catch (error) {
                    console.error('Ошибка при получении данных пользователя:', error);
                }
            }
        };

        fetchUserData();
    }, [telegramId]); // Зависимость от telegramId

    // Функция для получения telegram_id из Web App (настраивается в зависимости от интеграции)
    const getTelegramId = () => {
        // Проверяем, доступен ли Telegram WebApp SDK
        if (window.Telegram && window.Telegram.WebApp) {
            const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
            if (userId) {
                setTelegramId(userId);  // Сохраняем полученный telegram_id в состояние
            } else {
                console.error('Telegram ID не найден');
            }
        } else {
            console.error('WebApp SDK не доступен');
        }
    };

    // Вызов getTelegramId, как только компонент будет готов
    useEffect(() => {
        getTelegramId(); // Вызываем эту функцию для получения telegram_id при загрузке
    }, []);

    // Обработчик клика
    const handleClick = async () => {
        if (!telegramId) {
            console.error('telegram_id не найден');
            return;
        }

        // Увеличиваем tRSG на количество boost
        setTRSG(tRSG + boost);
        
        // Отправляем запрос на сервер
        try {
            await axios.post('http://localhost:3001/api/increment', {
                telegram_id: telegramId,
                amount: boost
            });
        } catch (error) {
            console.error('Ошибка при обновлении tRSG:', error);
        }
    };

    return (
        <div>
            <h1>tRSG Farming</h1>
            <button onClick={handleClick}>Клик! +{boost} tRSG</button>
            <p>Всего tRSG: {tRSG}</p>
        </div>
    );
}

export default Home;
