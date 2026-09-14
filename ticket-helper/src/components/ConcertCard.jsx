import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer.jsx';
import { useFavorites } from '../hooks/useFavorites.jsx';
import { formatDate, formatDateTime, getStatusBadge } from '../utils/helpers.js';
import { getPlatformById } from '../data/platforms.js';

export default function ConcertCard({ concert, variant = 'default' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(concert.id);
  const status = getStatusBadge(concert.onSaleTime);
  const minPrice = concert.prices?.[0];

  const getStatusBadgeStyle = (s) => {
    switch (s) {
      case 'confirmed':
        return {
          className: 'bg-macaron-green/15 border border-macaron-green/30 text-macaron-green-700 dark:text-macaron-green rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold flex items-center gap-1 anim-pulse-fast',
          text: '✅ 已官宣'
        };
      case 'rumored':
        return {
          className: 'bg-amber-500/15 border border-amber-500/30 text-amber-600 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold flex items-center gap-1',
          text: '⚠️ 待官宣'
        };
      case 'mock':
      default:
        return {
          className: 'bg-text-primary/5 border border-border-soft text-primary/70 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold flex items-center gap-1',
          text: '🧪 演示用'
        };
    }
  };
  const statusBadge = getStatusBadgeStyle(concert.status);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(concert.id);
  };

  if (variant === 'horizontal') {
    return (
      <Link to={`/concert/${concert.id}`} className="block">
        <div className="card-glass card-hover p-3 md:p-4 flex gap-3 md:gap-4">
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden">
            <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span className={statusBadge.className}>
                {statusBadge.text}
              </span>
              {concert.region && concert.region !== '中国大陆' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-accent-purple backdrop-blur-sm">
                  {concert.region.includes('香港') ? '🇭🇰 香港' : concert.region.includes('澳門') || concert.region.includes('澳门') ? '🇲🇴 澳门' : ''}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={statusBadge.className}>{statusBadge.text}</span>
                    <span className="text-xs text-accent-pink font-semibold">{concert.artist}</span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-text-primary truncate">{concert.title}</h3>
                  {concert.subtitle && (
                    <div className="text-[11px] text-text-muted mt-0.5 truncate">{concert.subtitle}</div>
                  )}
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
                    favorited ? 'text-accent-pink scale-110' : 'text-text-muted hover:text-accent-pink'
                  }`}
                  aria-label={favorited ? '取消收藏' : '收藏'}
                >
                  <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-1 mt-2 text-xs text-text-secondary">
                <div className="flex items-center gap-1 min-w-0">
                  <svg className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{concert.city} · {concert.venue.split(/[（(]/)[0].slice(0, 14)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-accent-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(concert.date)}{concert.showDateEnd && concert.showDateEnd !== concert.date ? ` 至 ${formatDate(concert.showDateEnd)}` : ''} · {concert.showTime}</span>
                </div>
                {concert.preSaleTime && (
                  <div className="flex items-center gap-1 text-accent-orange">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>会员预售：{formatDateTime(concert.preSaleTime)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="text-[10px] text-text-muted">{minPrice?.level || '最低档'}</div>
                <div className="text-accent-pink font-bold text-sm md:text-base">
                  {concert.priceRange.split(' - ')[0]}
                </div>
              </div>
              <CountdownTimer targetTime={concert.onSaleTime} size="sm" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/concert/${concert.id}`} className="block group">
      <div className="card-glass card-hover overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={concert.image}
            alt={concert.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/95 via-bg-card/30 to-transparent" />
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={statusBadge.className}>
              {statusBadge.text}
            </span>
            <span className={`tag border ${status.color} backdrop-blur-sm`}>
              {status.text}
            </span>
            {concert.region && concert.region !== '中国大陆' && (
              <span className="tag bg-white/85 text-accent-purple border border-white/50 backdrop-blur-sm font-bold">
                {concert.region.includes('香港') ? '🇭🇰 香港' : concert.region.includes('澳門') || concert.region.includes('澳门') ? '🇲🇴 澳门' : ''}
              </span>
            )}
            {concert.tags?.slice(0, 1).map(tag => (
              <span key={tag} className="tag bg-black/35 text-white border border-white/20 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              favorited
                ? 'bg-accent-pink/90 text-white scale-110 shadow-lg shadow-accent-pink/40'
                : 'bg-white/25 text-white hover:bg-white/40 hover:text-white'
            }`}
            aria-label={favorited ? '取消收藏' : '收藏'}
          >
            <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={statusBadge.className}>{statusBadge.text}</span>
              <div className="text-xs text-accent-cyan font-semibold">{concert.artist}</div>
            </div>
            <h3 className="text-base md:text-lg font-bold text-text-primary line-clamp-2 leading-tight drop-shadow-sm">
              {concert.title}
            </h3>
            {concert.subtitle && (
              <div className="text-[11px] md:text-xs text-text-secondary mt-1 opacity-90 line-clamp-1">
                {concert.subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex items-start gap-1.5 min-w-0 text-text-secondary">
              <svg className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="min-w-0">
                <div className="truncate font-medium text-text-primary">{concert.venue.split(/[（(]/)[0].slice(0, 20)}</div>
                {concert.venueDistrict && (
                  <div className="text-[11px] text-text-muted truncate">{concert.venueDistrict.slice(0, 24)}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <svg className="w-4 h-4 text-accent-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(concert.date)}{concert.showDateEnd && concert.showDateEnd !== concert.date ? ` 至 ${formatDate(concert.showDateEnd).split(' ')[0]}` : ''}</span>
              <span className="text-text-muted">·</span>
              <span>{concert.showTime}</span>
            </div>
            {concert.preSaleTime && (
              <div className="flex items-center gap-1.5 text-accent-orange text-[12px]">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">预售：{formatDateTime(concert.preSaleTime)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {concert.platforms && concert.platforms.length > 3 ? (
              <>
                {concert.platforms.slice(0, 2).map(pId => {
                  const p = getPlatformById(pId);
                  if (!p) return null;
                  return (
                    <span
                      key={pId}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${p.bgColor} ${p.textColor} border ${p.borderColor}`}
                    >
                      <span>{p.icon}</span>
                      {p.name}
                    </span>
                  );
                })}
                <span
                  className="bg-text-primary/5 border border-border-soft text-primary/80 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-medium"
                  title={concert.platforms.slice(2).map(pId => {
                    const p = getPlatformById(pId);
                    return p ? `${p.icon} ${p.name}` : '';
                  }).filter(Boolean).join('、')}
                >
                  +{concert.platforms.length - 2}
                </span>
              </>
            ) : (
              concert.platforms?.map(pId => {
                const p = getPlatformById(pId);
                if (!p) return null;
                return (
                  <span
                    key={pId}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${p.bgColor} ${p.textColor} border ${p.borderColor}`}
                  >
                    <span>{p.icon}</span>
                    {p.name}
                  </span>
                );
              })
            )}
          </div>

          <div className="flex items-end justify-between pt-2 border-t border-border-soft">
            <div>
              <div className="text-[11px] text-text-muted mb-0.5">{minPrice?.level || '最低档'}</div>
              <div className="text-accent-pink font-bold text-lg">
                {concert.priceRange.split(' - ')[0]}
                <span className="text-xs text-text-muted font-normal ml-1">起</span>
              </div>
            </div>
            <CountdownTimer targetTime={concert.onSaleTime} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
