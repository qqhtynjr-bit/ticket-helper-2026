export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[date.getDay()];
  return `${month}月${day}日 ${weekDay}`;
}

export function formatFullDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
}

export function getCountdown(targetTimeStr) {
  const target = new Date(targetTimeStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { expired: false, days, hours, minutes, seconds, total: diff };
}

export function padZero(num) {
  return num.toString().padStart(2, '0');
}

export function getStatusBadge(onSaleTimeStr) {
  const now = Date.now();
  const onSale = new Date(onSaleTimeStr).getTime();
  const diff = onSale - now;

  if (diff <= 0) {
    return { text: '已开售', color: 'bg-accent-green/20 text-accent-green border-accent-green/30' };
  }
  if (diff <= 24 * 60 * 60 * 1000) {
    return { text: '即将开票', color: 'bg-accent-pink/20 text-accent-pink border-accent-pink/30 animate-pulse-fast' };
  }
  if (diff <= 7 * 24 * 60 * 60 * 1000) {
    return { text: '本周开票', color: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30' };
  }
  return { text: '预约中', color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' };
}

export function getConcertStatusBadge(status) {
  switch (status) {
    case 'confirmed':
      return { text: '✅ 已官宣 confirmed', color: 'bg-accent-green/15 text-accent-green border-accent-green/30' };
    case 'rumored':
      return { text: '⚠️ 待官宣 rumored', color: 'bg-accent-orange/15 text-accent-orange border-accent-orange/30' };
    case 'mock':
    default:
      return { text: '🧪 演示 mock', color: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30' };
  }
}

export function sortConcerts(list, sortType) {
  const sorted = [...list];
  switch (sortType) {
    case 'onSaleAsc':
      return sorted.sort((a, b) => new Date(a.onSaleTime) - new Date(b.onSaleTime));
    case 'onSaleDesc':
      return sorted.sort((a, b) => new Date(b.onSaleTime) - new Date(a.onSaleTime));
    case 'dateAsc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'dateDesc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'priceLow':
      return sorted.sort((a, b) => a.prices[0].price - b.prices[0].price);
    case 'priceHigh':
      return sorted.sort((a, b) => b.prices[b.prices.length - 1].price - a.prices[a.prices.length - 1].price);
    default:
      return sorted;
  }
}

export function filterConcerts(list, { keyword, city, priceMin, priceMax }) {
  return list.filter(c => {
    if (keyword) {
      const kw = keyword.toLowerCase();
      const matchKeyword = 
        c.artist.toLowerCase().includes(kw) ||
        c.title.toLowerCase().includes(kw) ||
        c.city.toLowerCase().includes(kw);
      if (!matchKeyword) return false;
    }
    if (city && city !== 'all') {
      if (!c.city.includes(city)) return false;
    }
    if (priceMin) {
      if (c.prices[c.prices.length - 1].price < priceMin) return false;
    }
    if (priceMax) {
      if (c.prices[0].price > priceMax) return false;
    }
    return true;
  });
}

export function getAllCities(concerts) {
  const set = new Set(concerts.map(c => c.city));
  return ['all', ...Array.from(set).sort()];
}

export function getSaleChannelBadge(phase, badgeColor = 'blue') {
  const colorMap = {
    pink:   'bg-macaron-pink/90 text-white border-macaron-pink shadow-macaron-pink/30',
    rose:   'bg-rose-400/90 text-white border-rose-400 shadow-rose-400/30',
    purple: 'bg-macaron-purple/90 text-white border-macaron-purple shadow-macaron-purple/30',
    blue:   'bg-macaron-blue/90 text-white border-macaron-blue shadow-macaron-blue/30',
    green:  'bg-macaron-green/90 text-white border-macaron-green shadow-macaron-green/30',
    orange: 'bg-macaron-orange/90 text-white border-macaron-orange shadow-macaron-orange/30',
  };
  return {
    className: `w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-lg md:text-xl font-black border-2 shadow-lg ${colorMap[badgeColor] || colorMap.blue}`,
    phaseText: String(phase),
  };
}

export function getSeatTierStyle(tier) {
  const map = {
    'S+': { text: 'S+', className: 'bg-gradient-to-r from-rose-400 to-pink-400 text-white',      size: 'S+顶级' },
    'S':  { text: 'S',  className: 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white',  size: 'S优秀'   },
    'A':  { text: 'A',  className: 'bg-gradient-to-r from-sky-400 to-cyan-400 text-white',     size: 'A良好'   },
    'B':  { text: 'B',  className: 'bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-900', size: 'B一般' },
    'C':  { text: 'C',  className: 'bg-gradient-to-r from-stone-300 to-stone-400 text-stone-700',  size: 'C远区' },
  };
  return map[tier] || map['B'];
}
