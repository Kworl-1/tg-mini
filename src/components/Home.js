import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [tRSG, setTRSG] = useState(0);
    const [boost, setBoost] = useState(1);
    const [telegramId, setTelegramId] = useState(null);  // Состояние для хранения telegram_id
    const [isLoading, setIsLoading] = useState(true);  // Состояние для загрузки данных

    // Функция для получения telegram_id из Web App (настраивается в зависимости от интеграции)
    const getTelegramId = () => {
        if (window.Telegram && window.Telegram.WebApp) {
            const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
            if (userId) {
                console.log("Telegram ID найден:", userId);  // Логируем для отладки
                setTelegramId(userId);  // Сохраняем полученный telegram_id в состояние
            } else {
                console.error('Telegram ID не найден');
            }
        } else {
            console.error('WebApp SDK не доступен');
        }
    };

    // Получение данных пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            if (telegramId) {
                try {
                    console.log(`Запрос на сервер с telegram_id: ${telegramId}`);  // Логируем для отладки
                    const response = await axios.get('http://localhost:3001/api/user', {
                        params: { telegram_id: telegramId }
                    });
                    console.log('Данные пользователя:', response.data);  // Логируем ответ от сервера
                    setTRSG(response.data.tRSG_amount);
                    setBoost(response.data.farm_boots);
                } catch (error) {
                    console.error('Ошибка при получении данных пользователя:', error);
                }
            }
        };

        // Вызываем fetchUserData только если telegramId получен
        if (telegramId) {
            fetchUserData();
            setIsLoading(false);  // Данные получены, загрузка завершена
        }
    }, [telegramId]);

    // Вызов getTelegramId при монтировании компонента
    useEffect(() => {
        getTelegramId();
    }, []);

    // Обработчик клика
    const handleClick = async () => {
        if (!telegramId) {
            console.error('telegram_id не найден');
            return;
        }

        // Увеличиваем tRSG на количество boost
        const newTRSG = tRSG + boost;
        setTRSG(newTRSG);
        
        // Отправляем запрос на сервер
        try {
            console.log('Отправляем запрос на сервер для увеличения tRSG');  // Логируем запрос
            await axios.post('http://localhost:3001/api/increment', {
                telegram_id: telegramId,
                amount: boost
            });
        } catch (error) {
            console.error('Ошибка при обновлении tRSG:', error);
        }
    };

    // Если данные загружаются, показываем индикатор загрузки
    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1>tRSG Farming</h1>
            <button onClick={handleClick}>Клик! +{boost} tRSG</button>
            <p>Всего tRSG: {tRSG}</p>
        </div>
    );
}

export default Home;
