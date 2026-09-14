import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import ConcertCard from '../components/ConcertCard.jsx';
import PlatformCard from '../components/PlatformCard.jsx';
import CountdownTimer from '../components/CountdownTimer.jsx';
import { getUpcomingConcerts, getHotConcerts, DATA_META } from '../data/concerts.js';
import { platformList, getPlatformById } from '../data/platforms.js';
import { formatDate, formatDateTime, getConcertStatusBadge } from '../utils/helpers.js';

export default function Home() {
  const upcoming = getUpcomingConcerts().slice(0, 6);
  const hot = getHotConcerts();

  return (
    <div className="space-y-8 md:space-y-12 pb-8">
      {/* Hero Section */}
      <section className="pt-4 md:pt-8">
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-gradient-to-br from-bg-card via-bg-card/80 to-bg-card border border-border-dark">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-pink/10 border border-accent-pink/30 text-accent-pink text-xs md:text-sm font-medium mb-4 animate-pulse-fast">
              <span>🎉</span>
              <span>2026 下半年演唱会大幕开启</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
              <span className="gradient-text">追星抢票助手</span>
              <br />
              <span className="text-text-primary text-2xl md:text-4xl lg:text-5xl">陪你抢到每一场热爱</span>
            </h1>
            
            <p className="text-text-secondary text-sm md:text-lg max-w-2xl mb-6 md:mb-8 leading-relaxed">
              聚合大麦、猫眼、URBTIX、HK Ticketing 等16大主流票务平台及携程/Klook OTA合作渠道，一站式导航、抢票攻略、开票提醒，让你离偶像更近一步！
            </p>

            <div className="max-w-3xl">
              <SearchBar />
            </div>

            <div className="mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 max-w-none">
              {[
                { value: DATA_META.totalShows + '+', label: '场演出' },
                { value: '16', label: '票务平台' },
                { value: '40', label: '✅ 已官宣 confirmed' },
                { value: '8',  label: '⚠️ 待官宣 rumored' },
                { value: '100%', label: '核验直达' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-2 md:p-3 rounded-xl bg-white/40 border border-white/60 backdrop-blur-sm">
                  <div className="text-xl md:text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-text-muted mt-1 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 数据真实性说明条 */}
      <section className="px-0">
        <div className="data-notice">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="text-2xl md:text-3xl flex-shrink-0 animate-bounce-slow">📢</div>
            <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
              <p className="text-xs md:text-sm leading-relaxed font-semibold text-red-600/90 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                🚫 本前端站不具备实时爬虫能力，所有 ✅ 已官宣场次基于 2026-09-12 公开资料人工录入；⚠️ 待官宣场次请点击下方「核验直达」或 16 平台入口跳转官方确认真实性。核验链接为检索日快照，过期请直接进入官网搜索栏查询。
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="font-bold text-[#8a5a20] text-sm md:text-base">
                  关于数据真实性 · 最后更新：{DATA_META.lastUpdated}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/50 border border-[#e6c88a]/60 text-[11px] md:text-xs text-[#8a5a20]">
                  覆盖地区：{DATA_META.regionsCovered}
                </span>
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-[#7a4f1c]/90">
                ⚠️ {DATA_META.note}
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

      {/* 即将开票 - 重点展示 */}
      <section>
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div>
            <h2 className="section-title mb-1">
              <span className="text-2xl">⏰</span>
              <span className="gradient-text">即将开票</span>
            </h2>
            <p className="text-sm text-text-muted ml-9">第一时间设置提醒，抢票快人一步</p>
          </div>
          <Link to="/search?sort=onSaleAsc" className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-purple hover:bg-bg-card transition-all">
            查看全部
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Highlighted upcoming - 第一个重点展示 */}
        {upcoming[0] && (
          <Link to={`/concert/${upcoming[0].id}`} className="block mb-4 md:mb-6 group">
            <div className="card-glass card-hover overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue animate-pulse-fast" />
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
                  <img
                    src={upcoming[0].image}
                    alt={upcoming[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-card/90 md:block hidden" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent md:hidden" />
                  <div className="absolute top-4 left-4">
                    <span className="tag bg-accent-pink/90 text-white backdrop-blur-sm animate-bounce-slow border-0 text-sm px-4 py-2">
                      ⚡ 最受关注
                    </span>
                  </div>
                </div>
                <div className="p-5 md:p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {upcoming[0].region && upcoming[0].region !== '中国大陆' && (
                      <span className="tag bg-white/80 text-accent-purple border border-white/50 font-bold">
                        {upcoming[0].region.includes('香港') ? '🇭🇰 香港场' : upcoming[0].region.includes('澳門') || upcoming[0].region.includes('澳门') ? '🇲🇴 澳门场' : ''}
                      </span>
                    )}
                    {upcoming[0].tags?.map(tag => (
                      <span key={tag} className="tag bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {(() => { const s = getConcertStatusBadge(upcoming[0].status); return (
                      <span className={`tag border ${s.color}`}>{s.text}</span>
                    ); })()}
                    <div className="text-accent-cyan font-semibold text-sm">{upcoming[0].artist}</div>
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-primary mb-1 group-hover:gradient-text transition-all duration-300">
                    {upcoming[0].title}
                  </h3>
                  {upcoming[0].subtitle && (
                    <div className="text-sm text-text-muted mb-4">🎤 {upcoming[0].subtitle}</div>
                  )}
                  <div className="space-y-2 mb-5 text-sm md:text-base text-text-secondary">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="min-w-0">
                        <div className="font-medium text-text-primary">{upcoming[0].venue.split(/[（(]/)[0]}</div>
                        {upcoming[0].venueDistrict && (
                          <div className="text-xs text-text-muted mt-0.5">📍 {upcoming[0].venueDistrict}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        演出：{formatDate(upcoming[0].date)}
                        {upcoming[0].showDateEnd && upcoming[0].showDateEnd !== upcoming[0].date
                          ? ` 至 ${formatDate(upcoming[0].showDateEnd)}`
                          : ''}
                        {' '}· {upcoming[0].showTime}
                        {upcoming[0].capacity && <span className="text-text-muted ml-2">（{upcoming[0].capacity}）</span>}
                      </span>
                    </div>
                    {upcoming[0].preSaleTime && (
                      <div className="flex items-center gap-2 text-accent-orange">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">会员预售：{formatDateTime(upcoming[0].preSaleTime)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-accent-orange font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>公售开票：{formatDateTime(upcoming[0].onSaleTime)}</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="text-xs text-text-muted mb-2">距离开票还有</div>
                    <CountdownTimer targetTime={upcoming[0].onSaleTime} size="lg" />
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs text-text-muted mb-1">票价区间</div>
                      <div className="text-2xl md:text-3xl font-bold text-accent-pink">
                        {upcoming[0].priceRange}
                      </div>
                    </div>
                    <div className="btn-primary text-sm md:text-base">
                      查看详情 →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* 其他即将开票 - 卡片列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {upcoming.slice(1).map(concert => (
            <div key={`up-${concert.id}`} className="relative">
              <ConcertCard concert={concert} />
            </div>
          ))}
        </div>
      </section>

      {/* 热门演出卡片区 */}
      <section>
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div>
            <h2 className="section-title mb-1">
              <span className="text-2xl">🔥</span>
              <span>热门演唱会</span>
            </h2>
            <p className="text-sm text-text-muted ml-9">大家都在抢的热门场次</p>
          </div>
          <Link to="/search?sort=dateAsc" className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-pink hover:bg-bg-card transition-all">
            更多演出
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {hot.map(concert => (
            <ConcertCard key={`hot-${concert.id}`} concert={concert} />
          ))}
        </div>
      </section>

      {/* 抢票平台导航 */}
      <section>
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div>
            <h2 className="section-title mb-1">
              <span className="text-2xl">🎫</span>
              <span>抢票平台导航</span>
            </h2>
            <p className="text-sm text-text-muted ml-9">点击直达官网 + 平台专属抢票攻略</p>
          </div>
          <Link to="/guides" className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-cyan hover:bg-bg-card transition-all">
            全部攻略
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
          {platformList.map(platform => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-8">
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-gradient-to-br from-macaron-pink/25 via-macaron-purple/20 to-macaron-blue/25 border border-macaron-purple/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-macaron-pink/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float-gentle" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                <span className="gradient-text">抢票攻略在手</span>
                <span className="text-text-primary">，心仪门票到手！</span>
              </h3>
              <p className="text-text-secondary text-sm md:text-base">
                汇总大陆+港澳及 OTA 合作共 16 大平台实战攻略，注册→实名→排队→支付→捡漏，每一步都帮你踩好点！
              </p>
            </div>
            <Link to="/guides" className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue text-white font-bold text-base hover:shadow-xl hover:shadow-accent-pink/40 hover:scale-105 transition-all duration-300 active:scale-95">
              <span>📖</span>
              <span>立即查看抢票攻略</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
