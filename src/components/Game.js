import { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';

function Game() {
    const [btcPrice, setBtcPrice] = useState(null);
    const [userGuess, setUserGuess] = useState('');
    const [message, setMessage] = useState('');
    const [hasGuessed, setHasGuessed] = useState(false); // Флаг, проверяющий, сделал ли пользователь предположение

    useEffect(() => {
        const fetchBtcPrice = async () => {
            try {
                const response = await axios.get(
                    'https://burro-distinct-implicitly.ngrok-free.app/api/get-btc-price',
                    {
                        headers: {
                            'ngrok-skip-browser-warning': 'true' // Добавляем нужный заголовок
                        }
                    }
                );
                setBtcPrice(response.data.btcPrice);
            } catch (error) {
                console.error('Ошибка при получении цены BTC:', error);
            }
        };
        fetchBtcPrice();

        const checkUserGuess = async () => {
            const telegram_id = await getTelegramId();
            try {
                const response = await axios.get(
                    'https://burro-distinct-implicitly.ngrok-free.app/api/user',
                    {
                        params: { telegram_id },
                        headers: {
                            'ngrok-skip-browser-warning': 'true' // Добавляем нужный заголовок
                        }
                    }
                );
                if (response.data.btc_guess !== null) {
                    setHasGuessed(true); // Если у пользователя есть предположение, меняем флаг
                }
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };
        checkUserGuess();
    }, []);

    // Функция для получения telegram_id из WebApp
    const getTelegramId = async () => {
        return new Promise((resolve) => {
            if (window.Telegram && window.Telegram.WebApp) {
                // Для мобильного Telegram
                const telegram_id = window.Telegram.WebApp.initDataUnsafe?.user?.id;
                if (telegram_id) {
                    resolve(telegram_id);
                } else {
                    resolve(null); // если ID не найден
                }
            } else {
                resolve(null);
            }
        });
    };

    const submitGuess = async () => {
        const telegram_id = await getTelegramId(); // Получаем telegram_id асинхронно
        const guess = parseFloat(userGuess);
        
        if (hasGuessed) {
            setMessage('Вы уже отправили предположение!');
            return; // Если пользователь уже сделал предположение, не отправляем новое
        }

        if (isNaN(guess)) {
            setMessage('Пожалуйста, введите корректное число.');
            return;
        }

        try {
            const response = await axios.post('https://burro-distinct-implicitly.ngrok-free.app/api/set-btc-guess', {
                telegram_id,
                btc_guess: guess
            });
            setMessage(response.data.message);
            setUserGuess('');
            setHasGuessed(true); // Помечаем, что пользователь отправил предположение
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

            <h1>Mini-game: Guess BTC price</h1>
            <p className="btc-price">Current BTC price: {btcPrice ? `${btcPrice} USD` : 'Loading...'}</p>
            <input
                type="number"
                placeholder="Your BTC price assumption"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                disabled={hasGuessed} // Блокируем поле ввода, если пользователь уже сделал предположение
            />
            <button onClick={submitGuess} disabled={hasGuessed}>Send a guess</button>
            <p>{message}</p>
        </div>
    );
}

export default Game;
