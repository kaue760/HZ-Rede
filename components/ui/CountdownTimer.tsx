
import React, { useState, useEffect } from 'react';

interface TimeLeft {
  dias?: number;
  horas?: number;
  minutos?: number;
  segundos?: number;
}

const calculateTimeLeft = (expiryTimestamp: number): TimeLeft => {
    const difference = expiryTimestamp - new Date().getTime();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
        timeLeft = {
            dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
            horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutos: Math.floor((difference / 1000 / 60) % 60),
            segundos: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};

interface CountdownTimerProps {
    expiryTimestamp: number;
    onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryTimestamp, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(expiryTimestamp));

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(expiryTimestamp);
            setTimeLeft(newTimeLeft);

            if (Object.keys(newTimeLeft).length === 0) {
                if (onExpire) {
                    onExpire();
                }
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryTimestamp, onExpire]);

    const formatTime = (value?: number) => String(value || 0).padStart(2, '0');

    if (Object.keys(timeLeft).length === 0) {
        return <span className="text-red-400 font-bold">Teste Expirado</span>;
    }

    return (
        <div className="font-mono text-xl tracking-wider text-yellow-300">
            {timeLeft.dias! > 0 && <span>{formatTime(timeLeft.dias)}d </span>}
            <span>{formatTime(timeLeft.horas)}h </span>
            <span>{formatTime(timeLeft.minutos)}m </span>
            <span>{formatTime(timeLeft.segundos)}s</span>
        </div>
    );
};

export default CountdownTimer;
