import { useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
    const [btcPrice, setBtcPrice] = useState(null);
    const [userGuess, setUserGuess] = useState('');
    const [message, setMessage] = useState('');

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

    const getTelegramId = () => {
        // Реализуйте получение telegram_id из Web App или сохраните его в состоянии
        return 'USER_TELEGRAM_ID'; // Замените на реальный ID
    };

    const submitGuess = async () => {
        const telegram_id = getTelegramId();
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
        <div>
            <h1>Мини-игра: Угадай цену BTC</h1>
            <p>Текущая цена BTC: {btcPrice ? `${btcPrice} USD` : 'Загрузка...'}</p>
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
