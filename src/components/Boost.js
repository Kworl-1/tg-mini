import { useState, useEffect } from 'react';
import axios from 'axios';

function Boost() {
    const [boosts, setBoosts] = useState([]);
    const [userBoost, setUserBoost] = useState('');
    const [farmBoost, setFarmBoost] = useState(1);
    const [tRSG, setTRSG] = useState(0);

    useEffect(() => {
        const fetchBoosts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/boosts');
                setBoosts(response.data);
            } catch (error) {
                console.error('Ошибка при получении бустов:', error);
            }
        };
        fetchBoosts();

        const fetchUserData = async () => {
            const telegram_id = getTelegramId();
            try {
                const response = await axios.get('http://localhost:3001/api/user', {
                    params: { telegram_id }
                });
                setUserBoost(response.data.user_boost);
                setFarmBoost(response.data.farm_boost);
                setTRSG(response.data.tRSG_amount);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };
        fetchUserData();
    }, []);

    const getTelegramId = () => {
        // Реализуйте получение telegram_id из Web App или сохраните его в состоянии
        return 'USER_TELEGRAM_ID'; // Замените на реальный ID
    };

    const buyBoost = async (boostId) => {
        const telegram_id = getTelegramId();
        try {
            const response = await axios.post('http://localhost:3001/api/buy-boost', {
                telegram_id,
                boost_id: boostId
            });
            setUserBoost(response.data.user_boost);
            setFarmBoost(response.data.farm_boost);
            setTRSG(response.data.tRSG_amount);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                console.error('Ошибка при покупке буста:', error);
            }
        }
    };

    return (
        <div>
            <h1>Доступные бусты</h1>
            <p>Ваш текущий буст: {userBoost} (x{farmBoost})</p>
            <p>Ваш баланс tRSG: {tRSG}</p>
            <ul>
                {boosts.map((boost) => (
                    <li key={boost.id}>
                        {boost.boost_name} (Уровень {boost.boost_level}) - Множитель: x{boost.boost_multiplier} - Цена: {boost.boost_price} tRSG
                        <button
                            onClick={() => buyBoost(boost.id)}
                            disabled={tRSG < boost.boost_price}
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
