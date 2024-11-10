import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [tRSG, setTRSG] = useState(0);
    const [boost, setBoost] = useState(1);
    const [telegramId, setTelegramId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Функция для получения telegram_id из WebApp (только если это Telegram)
    const getTelegramId = () => {
        if (window.Telegram && window.Telegram.WebApp) {
            const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
            if (userId) {
                console.log("Telegram ID найден:", userId);
                setTelegramId(userId);  // Сохраняем ID пользователя
            } else {
                console.error('Не удалось получить telegram_id');
                setIsLoading(false);  // Завершаем загрузку
            }
        } else {
            console.error('WebApp SDK не доступен. Убедитесь, что приложение открыто внутри Telegram.');
            setIsLoading(false);  // Завершаем загрузку, если WebApp SDK не найден
        }
    };

    useEffect(() => {
        // Получаем telegram_id после монтирования компонента
        getTelegramId();
    }, []);

    // Получаем данные пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            if (telegramId) {
                try {
                    const response = await axios.get('http://localhost:3001/api/user', {
                        params: { telegram_id: telegramId }
                    });
                    setTRSG(response.data.tRSG_amount);
                    setBoost(response.data.farm_boots);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Ошибка при получении данных пользователя:', error);
                    setIsLoading(false);
                }
            }
        };

        if (telegramId) {
            fetchUserData();
        }
    }, [telegramId]);

    const handleClick = async () => {
        if (!telegramId) {
            console.error('telegram_id не найден');
            return;
        }

        const newTRSG = tRSG + boost;
        setTRSG(newTRSG);

        try {
            await axios.post('http://localhost:3001/api/increment', {
                telegram_id: telegramId,
                amount: boost
            });
        } catch (error) {
            console.error('Ошибка при обновлении tRSG:', error);
        }
    };

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
