import { useState, useEffect } from 'react';
import axios from 'axios';

function Leaderboard() {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/leaderboard');
                setLeaders(response.data);
            } catch (error) {
                console.error('Ошибка при получении таблицы лидеров:', error);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div>
            <h1>Таблица лидеров</h1>
            <ul>
                {leaders.map((user, index) => (
                    <li key={index}>
                        Telegram ID: {user.telegram_id} - Total tRSG: {user.tRSG_amount}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Leaderboard;
