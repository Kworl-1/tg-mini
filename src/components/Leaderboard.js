import { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Функция для получения данных с leaderboard
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(
                    'https://burro-distinct-implicitly.ngrok-free.app/api/leaderboard',
                    {
                        headers: {
                            'ngrok-skip-browser-warning': 'true'  // Добавляем заголовок
                        }
                    }
                );
                setLeaderboard(response.data); // Сохраняем данные в состояние
            } catch (error) {
                console.error('Ошибка при получении leaderboard:', error);
            }
        };
        fetchLeaderboard();
    }, []); // Данный эффект сработает только один раз при монтировании компонента

    return (
        <div className="leaderboard-container">
            <div className="menu">
                <a href="/">Home</a>
                <a href="/game">Game</a>
                <a href="/boost">Boost</a>
                <a href="/leaderboard">Leaderboard</a>
            </div>
            <h2>Leaderboard</h2>
            <ul className="leaderboard-list">
                {leaderboard.length > 0 ? (
                    leaderboard.map((user) => (
                        <li key={user.telegram_id} className="leaderboard-item">
                            <strong>{user.telegram_id}</strong>: {user.tRSG_amount} tRSG
                        </li>
                    ))
                ) : (
                    <p>Loading Leaders ...</p>
                )}
            </ul>
        </div>
    );
}

export default Leaderboard;
