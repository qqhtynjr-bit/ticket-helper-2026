import { useParams, Link, useNavigate } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer.jsx';
import ConcertCard from '../components/ConcertCard.jsx';
import { getConcertById, concerts, DATA_META } from '../data/concerts.js';
import { getPlatformById } from '../data/platforms.js';
import { useFavorites } from '../hooks/useFavorites.jsx';
import { formatFullDate, formatDate, formatDateTime, getStatusBadge, getSaleChannelBadge, getSeatTierStyle } from '../utils/helpers.js';

export default function ConcertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const concert = getConcertById(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!concert) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">🎫</div>
        <h2 className="text-2xl font-bold mb-2">未找到该演出</h2>
        <p className="text-text-secondary mb-6">可能演出已结束或链接有误</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          返回首页
        </button>
      </div>
    );
  }

  const favorited = isFavorite(concert.id);
  const status = getStatusBadge(concert.onSaleTime);
  const relatedConcerts = concerts
    .filter(c => c.id !== concert.id && (c.artist === concert.artist || c.city === concert.city))
    .slice(0, 4);
  const isHK = concert.region?.includes('香港');
  const isMO = concert.region?.includes('澳門') || concert.region?.includes('澳门');
  const currency = isHK || isMO ? (isHK ? 'HK$' : 'MOP$') : '¥';

  return (
    <div className="py-4 md:py-6 space-y-6 md:space-y-8 pb-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card/50 text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="aspect-[21/9] md:aspect-[21/8] relative">
          <img
            src={concert.image}
            alt={concert.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-cream via-bg-cream/60 to-bg-cream/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-cream/60 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
            <span className={`tag border ${status.color} backdrop-blur-md text-xs md:text-sm px-3 py-1.5`}>
              {status.text}
            </span>
            {concert.region && (
              <span className="tag bg-white/85 text-accent-purple border border-white/50 backdrop-blur-md text-xs md:text-sm px-3 py-1.5 font-bold">
                {isHK ? '🇭🇰 中国香港' : isMO ? '🇲🇴 中国澳门' : '📍 中国大陆'} · {concert.region}
              </span>
            )}
            {concert.tags?.map(tag => (
              <span key={tag} className="tag bg-macaron-purple/25 text-accent-purple border border-macaron-purple/40 backdrop-blur-md text-xs md:text-sm px-3 py-1.5">
                #{tag}
              </span>
            ))}
          </div>

          <div className="text-accent-cyan font-semibold text-sm md:text-lg mb-1">{concert.artist}</div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-text-primary mb-1 leading-tight">
            {concert.title}
          </h1>
          {concert.subtitle && (
            <div className="text-sm md:text-base text-text-secondary font-medium mb-4 md:mb-4">
              🎤 {concert.subtitle}
            </div>
          )}

          <div className="mb-4 md:mb-5 flex justify-center w-full">
            {concert.status === 'confirmed' && (
              <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-macaron-green/15 border border-macaron-green/30 text-macaron-green-700 font-semibold text-xs sm:text-sm shadow-macaron-sm animate-pulse-soft">
                ✅ 已官宣 · 本场信息基于公开资料核验，仍请以官方公告为准
              </div>
            )}
            {concert.status === 'rumored' && (
              <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-orange-400/15 border border-orange-400/40 text-orange-600 font-semibold text-xs sm:text-sm">
                ⚠️ 待官宣 · 信息仍可能变动，强烈建议点击「核验直达」跳转官方确认最新状态
              </div>
            )}
            {concert.status === 'mock' && (
              <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-text-primary/5 border border-border-soft text-primary/70 font-semibold text-xs sm:text-sm">
                🧪 演示用 · 排期、价格、场馆仅作功能演示，请以官方发布信息为准
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 text-text-secondary text-sm md:text-base">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {concert.city}
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm md:text-base">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatFullDate(concert.date)}
              {concert.showDateEnd && concert.showDateEnd !== concert.date && (
                <span className="text-text-muted"> 至 {formatFullDate(concert.showDateEnd).slice(5)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm md:text-base">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {concert.showTime}
            </div>
            {concert.capacity && (
              <div className="flex items-center gap-2 text-text-secondary text-sm md:text-base">
                <span>👥</span>
                {concert.capacity}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Countdown Card */}
          <div className="card-glass p-5 md:p-6 border border-accent-pink/20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-accent-pink/30 to-accent-purple/30 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-sm text-text-muted mb-1">🎯 距离公售开票还有</div>
                  <div className="text-xs text-text-secondary space-y-0.5">
                    {concert.preSaleTime && (
                      <div className="text-accent-orange">
                        🔒 会员/粉丝预售：{formatDateTime(concert.preSaleTime)}
                      </div>
                    )}
                    <div>
                      🔔 公售开票时间：{formatDateTime(concert.onSaleTime)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(concert.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    favorited
                      ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30'
                      : 'bg-bg-card border border-border-soft text-text-secondary hover:text-accent-pink hover:border-accent-pink/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">{favorited ? '已收藏' : '收藏'}</span>
                </button>
              </div>
              <div className="flex justify-center py-3">
                <CountdownTimer targetTime={concert.onSaleTime} size="lg" />
              </div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="card-glass p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
              <span>📍</span> 演出场馆与地址
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="font-semibold text-text-primary text-base md:text-lg">
                  {concert.venue}
                </div>
                {concert.venueDistrict && (
                  <div className="text-text-secondary text-sm flex items-start gap-1.5">
                    <span className="flex-shrink-0 mt-0.5">🗺️</span>
                    <span>{concert.venueDistrict}</span>
                  </div>
                )}
                <div className="text-xs text-text-muted pt-1">
                  💡 建议提前 60-90 分钟到达场馆，配合安检入场
                  {isHK && '；港铁可直达红磡/中环站，建议使用八达通'}
                  {isMO && '；建议经港珠澳大桥/金光飞航前往，预留 2 小时通关时间'}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Prices */}
          <div className="card-glass p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
              <span>💰</span> 票价档位
              <span className="text-xs md:text-sm font-normal text-text-muted ml-1">
                （{currency} · 含税费，服务费以平台显示为准）
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {concert.prices.map((priceObj, idx) => {
                const isLow = idx === 0;
                const isHigh = idx === concert.prices.length - 1;
                return (
                  <div
                    key={idx}
                    className={`relative p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                      isHigh
                        ? 'bg-gradient-to-br from-accent-pink/10 to-accent-purple/10 border-accent-pink/40'
                        : isLow
                        ? 'bg-gradient-to-br from-accent-green/10 to-accent-cyan/10 border-accent-green/40'
                        : 'bg-bg-card border-border-soft hover:border-accent-purple/50'
                    }`}
                  >
                    {isHigh && (
                      <span className="absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full bg-accent-pink text-white font-semibold">
                        最高价
                      </span>
                    )}
                    {isLow && (
                      <span className="absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full bg-accent-green text-white font-semibold">
                        起步价
                      </span>
                    )}
                    <div className={`text-2xl md:text-3xl font-bold mb-1 ${
                      isHigh ? 'text-accent-pink' : isLow ? 'text-accent-green' : 'text-text-primary'
                    }`}>
                      {currency}{priceObj.price?.toLocaleString?.() ?? priceObj.price}
                    </div>
                    <div className="text-xs text-text-secondary leading-snug font-medium">
                      {priceObj.level || `档位 ${idx + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Map Section */}
          {concert.seatMap && (
            <div className="card-glass p-5 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span>🎭</span> 座位分区与视野分析
                <span className="text-xs md:text-sm font-normal text-text-muted ml-1">
                  （示意图·非官方1:1）
                </span>
              </h2>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border-soft mb-5">
                <img
                  src={`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(concert.seatMap.imagePrompt)}&image_size=landscape_16_9`}
                  alt="座位分区示意图"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {concert.seatMap.zones?.map((zone, idx) => {
                  const tierStyle = getSeatTierStyle(zone.tier);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-bg-card border border-border-soft hover:border-accent-purple/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-text-primary text-sm">{zone.zoneName}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierStyle.className}`}>
                          {tierStyle.text}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-text-primary mb-1">
                        {currency}{zone.price?.toLocaleString?.() ?? zone.price}
                      </div>
                      <div className="text-[11px] md:text-xs text-text-muted leading-snug">
                        {zone.viewAdvice}
                      </div>
                    </div>
                  );
                })}
              </div>
              {concert.seatMap.officialMapUrls && concert.seatMap.officialMapUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {concert.seatMap.officialMapUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-macaron-blue/15 border border-macaron-blue/40 text-macaron-blue-700 text-xs font-semibold hover:bg-macaron-blue/25 transition-all"
                    >
                      📂 官方座位图 {idx + 1}
                    </a>
                  ))}
                </div>
              )}
              <p className="text-[11px] md:text-xs text-text-muted mt-3 leading-snug pt-2 border-t border-border-soft">
                {concert.seatMap.disclaimer}
              </p>
            </div>
          )}

          {/* Sale Channels Timeline */}
          <div className="card-glass p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-5 flex items-center gap-2">
              <span>🔐</span> 多渠道抢票时间表
              <span className="text-xs md:text-sm font-normal text-text-muted ml-1">
                （共 {concert.saleChannels?.length ?? 0} 轮，按时间顺序）
              </span>
            </h2>
            <div className="space-y-5">
              {concert.saleChannels?.map((s, idx) => {
                const badge = getSaleChannelBadge(s.phase, s.badgeColor);
                const typeLabelMap = {
                  survey: { text: '调查/资格', className: 'bg-stone-400/20 text-stone-600 border-stone-400/30' },
                  presale: { text: '优先购', className: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30' },
                  partner: { text: '合作渠道', className: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30' },
                  general: { text: '公售', className: 'bg-accent-green/20 text-accent-green border-accent-green/30' },
                };
                const typeStyle = typeLabelMap[s.type] || typeLabelMap.general;
                return (
                  <div key={s.id || idx} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={badge.className}>
                        {badge.phaseText}
                      </div>
                      {idx < (concert.saleChannels?.length ?? 0) - 1 && (
                        <div className="w-0.5 flex-1 bg-border-soft mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                        <span className="font-bold text-text-primary">{s.name}</span>
                        <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full border font-semibold ${typeStyle.className}`}>
                          {typeStyle.text}
                        </span>
                      </div>
                      {s.eligibility && (
                        <div className="text-xs text-text-muted italic mb-2">
                          {s.eligibility}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {s.dateTime && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-card border border-border-soft text-xs text-text-secondary">
                            🗓️ {formatDateTime(s.dateTime)}
                            {s.dateTimeEnd && s.dateTimeEnd !== s.dateTime && (
                              <span className="text-text-muted"> → {formatDateTime(s.dateTimeEnd)}</span>
                            )}
                          </span>
                        )}
                        {s.limits && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-card border border-border-soft text-xs text-text-secondary">
                            🎟️ {s.limits}
                          </span>
                        )}
                        {s.platforms?.map((p, pIdx) => {
                          const plat = getPlatformById(p);
                          if (!plat) return null;
                          return (
                            <span
                              key={pIdx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-card border border-border-soft text-xs"
                            >
                              <span>{plat.icon}</span>
                              <span className={plat.textColor}>{plat.name}</span>
                              <Link
                                to={`/guide/${plat.id}`}
                                className="text-text-muted hover:text-accent-purple transition-colors"
                                title={`查看${plat.name}抢票攻略`}
                              >
                                🔗
                              </Link>
                            </span>
                          );
                        })}
                      </div>
                      {s.registerUrl && (
                        <div className="mb-2">
                          <a
                            href={s.registerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400/90 to-orange-400/90 text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                          >
                            立即完成资格/调查 →
                          </a>
                        </div>
                      )}
                      {s.tips && s.tips.length > 0 && (
                        <details className="group rounded-xl bg-bg-card/50 border border-border-soft overflow-hidden">
                          <summary className="px-4 py-2.5 cursor-pointer text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 list-none [&::-webkit-details-marker]:hidden">
                            <span className="group-open:rotate-90 transition-transform text-text-muted">▶</span>
                            📌 本轮专属抢票要点（{s.tips.length} 条）
                          </summary>
                          <ul className="px-4 pb-3 pt-1 space-y-1.5">
                            {s.tips.map((tip, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed">
                                <span className="text-accent-purple mt-0.5 flex-shrink-0">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="card-glass p-5 md:p-6 space-y-5">
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
                <span>✨</span> 演出介绍
              </h2>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {concert.description}
              </p>
            </div>

            {/* Personal Notice 入场须知 */}
            <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-macaron-purple/10 to-macaron-blue/10 border border-macaron-purple/30">
              <div className="text-xs text-accent-purple font-bold mb-3 flex items-center gap-1.5">
                <span>⚠️</span> 入场须知 & 购票规则
              </div>
              <ul className="text-xs md:text-sm text-text-secondary space-y-2">
                {concert.notice ? (
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple mt-0.5">•</span>
                    <span className="font-medium">{concert.notice}</span>
                  </li>
                ) : null}
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-0.5">•</span>
                  <span>建议提前完成各售票平台的实名信息绑定，并预存/充值支付方式</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-0.5">•</span>
                  <span>一人一票制，{isHK || isMO ? '儿童不论年龄均需持票入场（港澳场馆严格执行）' : '儿童身高限制与凭票要求以官方公告为准'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-0.5">•</span>
                  <span>禁止携带专业摄像设备、瓶装水、打火机、自拍杆等物品入场</span>
                </li>
                {isHK && (
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple mt-0.5">•</span>
                    <span className="font-medium text-[#7a5c00]">🇭🇰 香港场提示：须携带购票时登记的身份证件正本（香港身份证 / 港澳通行证 / 回乡证），入场需核验</span>
                  </li>
                )}
                {isMO && (
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple mt-0.5">•</span>
                    <span className="font-medium text-[#7a5c00]">🇲🇴 澳门场提示：建议预留通关时间；金光飞航/港珠澳大桥乘客可选择广星套票更划算</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-text-muted mt-0.5">•</span>
                  <span className="text-text-muted/90 text-[11px] md:text-xs">💻 本页面信息由静态数据渲染，不代表实时售票状态，余票情况请点上方「核验直达」按钮跳官方售票渠道查看。</span>
                </li>
              </ul>
            </div>

            {/* Data Source & Authenticity —— Detail Page Specific */}
            <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-macaron-yellow/15 via-macaron-orange/10 to-macaron-pink/10 border border-macaron-orange/40">
              <div className="text-xs font-bold text-[#8a5a20] mb-3 flex items-center gap-1.5">
                <span>📌</span> 本页数据来源与核验说明
              </div>
              <div className="space-y-2 text-xs md:text-sm text-[#7a4f1c]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span><strong>本页最后更新：</strong>{concert.lastUpdated}</span>
                  <span><strong>币种：</strong>{isHK ? '港币 HKD' : isMO ? '澳门币 MOP' : '人民币 CNY'}</span>
                </div>
                <div>
                  <strong>数据来源：</strong>{concert.dataSource}
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="text-[#8a5a20] font-semibold mr-1">官方核验渠道：</span>
                  {concert.platforms?.map(pId => {
                    const p = getPlatformById(pId);
                    if (!p) return null;
                    return (
                      <a
                        key={pId}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 hover:bg-white border ${p.borderColor} ${p.textColor} text-[11px] font-medium hover:scale-[1.02] transition-all`}
                      >
                        <span>{p.icon}</span>
                        <span>{p.fullName} 官网</span>
                      </a>
                    );
                  })}
                </div>
                <div className="border-t border-orange-300/30 my-3" />
                {concert.verifyLinks && concert.verifyLinks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {concert.verifyLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-orange-700/70">{link.date} · {link.source}</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-700 underline decoration-orange-400/30 underline-offset-2 hover:text-orange-800 font-medium text-xs md:text-sm truncate"
                        >
                          {link.label}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-orange-700/70">暂无核验链接</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tickets & Guides */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sticky Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Quick Price Summary */}
            <div className="card-glass p-5 md:p-6">
              <div className="text-sm text-text-muted mb-1">票价区间</div>
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-4">
                {concert.priceRange}
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div className="p-3 rounded-xl bg-bg-card">
                  <div className="text-text-muted text-xs mb-1">会员预售</div>
                  <div className="font-semibold text-accent-orange">
                    {concert.preSaleTime ? formatDateTime(concert.preSaleTime).split(' ')[0] : '—'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-bg-card">
                  <div className="text-text-muted text-xs mb-1">公售开票</div>
                  <div className="font-semibold text-accent-purple">{formatDateTime(concert.onSaleTime).split(' ')[0]}</div>
                </div>
                <div className="p-3 rounded-xl bg-bg-card col-span-2">
                  <div className="text-text-muted text-xs mb-1">首演日期</div>
                  <div className="font-semibold text-accent-green">{formatDate(concert.date)}</div>
                </div>
              </div>
            </div>

            {/* Verify Direct Links */}
            <div className="card-glass p-5 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <span>🚀</span>
                <h3 className="text-lg font-bold">核验直达（跳官方渠道）</h3>
              </div>
              <p className="text-xs text-text-muted mb-4">一键跳转官方售票页/社交平台实时核验最新状态</p>
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                {concert.platformSearchUrl && Object.entries(concert.platformSearchUrl).map(([platformId, url]) => {
                  const p = getPlatformById(platformId);
                  if (!p) return null;
                  return (
                    <a
                      key={platformId}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary h-9 text-xs sm:text-sm flex items-center justify-center gap-1.5 px-2"
                    >
                      <span>{p.icon}</span>
                      <span className="truncate">{p.name} 售票页</span>
                    </a>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://s.weibo.com/weibo?q=${encodeURIComponent(concert.artist + '演唱会 官宣')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1.5 px-2 rounded-xl bg-macaron-purple/12 border border-macaron-purple/30 text-macaron-purple-700 font-medium hover:bg-macaron-purple/20 transition-all"
                >
                  📱 微博搜官宣
                </a>
                <a
                  href={`https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(concert.artist + '演唱会 2026')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1.5 px-2 rounded-xl bg-macaron-purple/12 border border-macaron-purple/30 text-macaron-purple-700 font-medium hover:bg-macaron-purple/20 transition-all"
                >
                  📖 小红书2026
                </a>
                <a
                  href={`https://m.sz.bendibao.com/news/sou/?q=${encodeURIComponent(concert.artist + '演唱会')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1.5 px-2 rounded-xl bg-macaron-purple/12 border border-macaron-purple/30 text-macaron-purple-700 font-medium hover:bg-macaron-purple/20 transition-all"
                >
                  🏙️ 深圳本地宝
                </a>
                <a
                  href={`https://m.am.bendibao.com/xiuxian/sou/?q=${encodeURIComponent(concert.artist + '演唱会')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 text-xs sm:text-sm flex items-center justify-center gap-1.5 px-2 rounded-xl bg-macaron-purple/12 border border-macaron-purple/30 text-macaron-purple-700 font-medium hover:bg-macaron-purple/20 transition-all"
                >
                  🎰 澳门本地宝
                </a>
              </div>
            </div>

            {/* Ticket Platforms */}
            <div className="card-glass p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🎫</span> 购票直达
              </h3>
              <div className="space-y-3">
                {concert.platforms.map(pId => {
                  const platform = getPlatformById(pId);
                  if (!platform) return null;
                  return (
                    <a
                      key={pId}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${platform.bgColor} ${platform.borderColor} hover:shadow-lg hover:shadow-current/10`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {platform.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-text-primary text-base flex items-center gap-1.5">
                          {platform.fullName}
                          <svg className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <div className="text-xs text-text-muted truncate">点击前往官网购票</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Platform Guides */}
            <div className="card-glass p-5 md:p-6 border border-accent-purple/30 bg-gradient-to-br from-accent-purple/5 to-transparent">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📖</span> 抢票攻略
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                提前掌握本场所用平台的抢票技巧，含注册、实名、排队、支付、捡漏全流程！
              </p>
              <div className="space-y-2">
                {concert.platforms.map(pId => {
                  const platform = getPlatformById(pId);
                  if (!platform) return null;
                  return (
                    <Link
                      key={`guide-${pId}`}
                      to={`/guide/${platform.id}`}
                      className={`flex items-center justify-between p-3 rounded-xl bg-bg-card/70 border border-border-soft hover:border-accent-purple/60 transition-all`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <span>{platform.icon}</span>
                        <span className={platform.textColor}>{platform.name}抢票攻略</span>
                      </span>
                      <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Bottom Notice */}
      <section className="pt-2">
        <div className="data-notice">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="text-2xl md:text-3xl flex-shrink-0">💡</div>
            <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#8a5a20] text-sm md:text-base">
                  ✅ 以上信息为模拟演示 · 本站建议仅前往官方平台购票，避免黄牛与二手诈骗
                </span>
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-[#7a4f1c]/90">
                {DATA_META.note} · 如需核验或购票请点击下方官方渠道：
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1">
                {DATA_META.verifyChannels.map(channel => {
                  const [name, url] = channel.split('：');
                  return (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 hover:bg-white border border-[#e6c88a]/50 text-[11px] md:text-xs font-medium text-[#8a5a20] hover:scale-[1.02] transition-all"
                    >
                      <span>🔗</span>
                      <span>{name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Concerts */}
      {relatedConcerts.length > 0 && (
        <section className="pt-4">
          <h2 className="section-title mb-5">
            <span>🎤</span> 你可能还想看
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {relatedConcerts.map(c => (
              <ConcertCard key={`rel-${c.id}`} concert={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
