import { useState, useEffect } from 'react';
import axios from 'axios';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Функция для получения данных с leaderboard
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/leaderboard');
                setLeaderboard(response.data); // Сохраняем данные в состояние
            } catch (error) {
                console.error('Ошибка при получении leaderboard:', error);
            }
        };
        fetchLeaderboard();
    }, []); // Данный эффект сработает только один раз при монтировании компонента

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.length > 0 ? (
                    leaderboard.map((user) => (
                        <li key={user.telegram_id}>
                            <strong>{user.telegram_id}</strong>: {user.tRSG_amount} tRSG
                        </li>
                    ))
                ) : (
                    <p>Загрузка лидеров...</p>
                )}
            </ul>
        </div>
    );
}

export default Leaderboard;
