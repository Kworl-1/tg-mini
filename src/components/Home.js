import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [tRSG, setTRSG] = useState(0);
    const [boost, setBoost] = useState(1);

    // Получение данных пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            const telegram_id = getTelegramId(); // Функция для получения telegram_id
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
    }, []);

    // Функция для получения telegram_id из Web App (настраивается в зависимости от интеграции)
    const getTelegramId = () => {
        // Реализуйте получение telegram_id из Web App или сохраните его в состоянии
        return 'USER_TELEGRAM_ID'; // Замените на реальный ID
    };

    // Обработчик клика
    const handleClick = async () => {
        const telegram_id = getTelegramId();
        setTRSG(tRSG + boost);
        try {
            await axios.post('http://localhost:3001/api/increment', {
                telegram_id,
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
