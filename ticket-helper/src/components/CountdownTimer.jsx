import { useState, useEffect } from 'react';
import { getCountdown, padZero } from '../utils/helpers.js';

export default function CountdownTimer({ targetTime, size = 'md' }) {
  const [countdown, setCountdown] = useState(() => getCountdown(targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  if (countdown.expired) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/20 text-accent-green text-sm font-semibold border border-accent-green/30 ${size === 'sm' ? 'text-xs' : ''}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
        </span>
        火热开售中
      </div>
    );
  }

  const sizeClasses = {
    sm: {
      box: 'w-7 h-7 text-xs',
      label: 'text-[10px]',
      gap: 'gap-1',
    },
    md: {
      box: 'w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl',
      label: 'text-[10px] md:text-xs',
      gap: 'gap-1.5 md:gap-2',
    },
    lg: {
      box: 'w-12 h-12 md:w-16 md:h-16 text-xl md:text-3xl',
      label: 'text-xs md:text-sm',
      gap: 'gap-2 md:gap-3',
    },
  };

  const cls = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center ${cls.gap}`}>
      <TimeUnit value={countdown.days} label="天" cls={cls} highlight={countdown.days > 0} />
      <span className={`text-accent-pink font-bold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg'}`}>:</span>
      <TimeUnit value={countdown.hours} label="时" cls={cls} />
      <span className={`text-accent-pink font-bold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg'}`}>:</span>
      <TimeUnit value={countdown.minutes} label="分" cls={cls} />
      <span className={`text-accent-pink font-bold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg'}`}>:</span>
      <TimeUnit value={countdown.seconds} label="秒" cls={cls} pulse />
    </div>
  );
}

function TimeUnit({ value, label, cls, highlight, pulse }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`${cls.box} flex items-center justify-center rounded-lg font-bold text-white
          ${highlight ? 'bg-gradient-to-br from-accent-pink to-accent-purple shadow-lg shadow-accent-pink/30' : 'bg-bg-card border border-border-dark'}
          ${pulse ? 'animate-pulse-fast' : ''}
        `}
      >
        {padZero(value)}
      </div>
      <span className={`${cls.label} text-text-muted mt-1 font-medium`}>{label}</span>
    </div>
  );
}
