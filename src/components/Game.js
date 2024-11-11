import { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';

function Game() {
    const [btcPrice, setBtcPrice] = useState(null);
    const [userGuess, setUserGuess] = useState('');
    const [message, setMessage] = useState('');
    const tg = window.Telegram.WebApp; // Используем объект Telegram WebApp для получения данных

    useEffect(() => {
        const fetchBtcPrice = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/get-btc-price');
                setBtcPrice(response.data.btcPrice);
            } catch (error) {
                console.error('Ошибка при получении цены BTC:', error);
            }
        };
        fetchBtcPrice();
    }, []);

    // Функция для получения telegram_id из WebApp
    const getTelegramId = async () => {
        return new Promise((resolve) => {
            if (window.Telegram && window.Telegram.WebApp) {
                const telegram_id = window.Telegram.WebApp.initDataUnsafe?.user?.id;
                if (telegram_id) {
                    resolve(telegram_id);
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    };

    const submitGuess = async () => {
        const telegram_id = await getTelegramId(); // Получаем telegram_id асинхронно
        const guess = parseFloat(userGuess);
        
        if (isNaN(guess)) {
            setMessage('Пожалуйста, введите корректное число.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/set-btc-guess', {
                telegram_id,
                btc_guess: guess
            });
            setMessage(response.data.message);
            setUserGuess('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Ошибка при отправке предположения');
            }
        }
    };

    return (
        <div className="game-container">
            {/* Меню */}
            <div className="menu">
                <a href="/">Home</a>
                <a href="/game">Game</a>
                <a href="/boost">Boost</a>
                <a href="/leaderboard">Leaderboard</a>
            </div>

            <h1>Мини-игра: Угадай цену BTC</h1>
            <p className="btc-price">Текущая цена BTC: {btcPrice ? `${btcPrice} USD` : 'Загрузка...'}</p>
            <input
                type="number"
                placeholder="Ваше предположение о цене BTC"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
            />
            <button onClick={submitGuess}>Отправить предположение</button>
            <p>{message}</p>
        </div>
    );
}

export default Game;
