import { useState, useEffect } from 'react';
import axios from 'axios';
import './Boost.css';

function Boost() {
    const [boosts, setBoosts] = useState([]);
    const [userBoost, setUserBoost] = useState('');
    const [farmBoost, setFarmBoost] = useState(1);
    const [tRSG, setTRSG] = useState(0);
    const tg = window.Telegram.WebApp;

    // Функция для получения telegram_id пользователя
    const getTelegramId = () => {
        return tg.initDataUnsafe?.user?.id || null;
    };

    useEffect(() => {
        tg.ready();

        const fetchBoosts = async () => {
            try {
                const response = await axios.get('https://burro-distinct-implicitly.ngrok-free.app/api/boosts', {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                setBoosts(response.data);
            } catch (error) {
                console.error('Ошибка при получении бустов:', error);
            }
        };
        fetchBoosts();

        const fetchUserData = async () => {
            const telegram_id = getTelegramId();
            if (telegram_id) {
                try {
                    const response = await axios.get('https://burro-distinct-implicitly.ngrok-free.app/api/user', {
                        params: { telegram_id },
                        headers: {
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });
                    setUserBoost(response.data.user_boost);
                    setFarmBoost(response.data.farm_boost);
                    setTRSG(response.data.tRSG_amount);
                } catch (error) {
                    console.error('Ошибка при получении данных пользователя:', error);
                }
            } else {
                console.warn("Не удалось получить ID пользователя Telegram.");
            }
        };
        
        fetchUserData();
    }, []); // Здесь закрываем useEffect

    // Функция для покупки буста
    const buyBoost = async (boostId) => {
        const telegram_id = getTelegramId();
        if (telegram_id) {
            try {
                // Запрос на покупку буста
                const response = await axios.post('https://burro-distinct-implicitly.ngrok-free.app/api/buy-boost', {
                    telegram_id,
                    boost_id: boostId
                });
                
                // Получение обновленных данных пользователя
                const updatedUserData = response.data;
                
                // Сложение текущего множителя с новым
                setUserBoost(updatedUserData.user_boost);
                setFarmBoost(prevFarmBoost => prevFarmBoost + updatedUserData.boost_multiplier); // добавляем новый множитель
                setTRSG(updatedUserData.tRSG_amount);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    console.error('Ошибка при покупке буста:', error);
                }
            }
        } else {
            console.error("Не удалось получить ID пользователя Telegram.");
        }
    };

    return (
        <div className="boost-container">
            {/* Меню навигации */}
            <div className="menu">
                <a href="/">Home</a>
                <a href="/game">Game</a>
                <a href="/boost">Boost</a>
                <a href="/leaderboard">Leaderboard</a>
            </div>

            {/* Основной контент */}
            <h1>Available boosts</h1>
            <p>Your current boost: {userBoost} (x{farmBoost})</p>
            <p>Balance tRSG: {tRSG}</p>
            <ul className="boost-list">
                {boosts.map((boost) => (
                    <li key={boost.id} className="boost-item">
                        {boost.boost_name} (Tier {boost.boost_level}) - Multiplier: x{boost.boost_multiplier} - Price: {boost.boost_price} tRSG
                        <button
                            onClick={() => buyBoost(boost.id)}
                            disabled={tRSG < boost.boost_price}
                            className="buy-button"
                        >
                            Купить
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Boost;
