import { Link } from 'react-router-dom';
import ConcertCard from '../components/ConcertCard.jsx';
import { useFavorites } from '../hooks/useFavorites.jsx';
import { concerts, DATA_META } from '../data/concerts.js';
import { getStatusBadge } from '../utils/helpers.js';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  const favoriteConcerts = concerts
    .filter(c => favorites.includes(c.id))
    .sort((a, b) => {
      const badgeA = getStatusBadge(a.onSaleTime);
      const badgeB = getStatusBadge(b.onSaleTime);
      const priority = { '即将开票': 0, '本周开票': 1, '预约中': 2, '已开售': 3 };
      return (priority[badgeA.text] ?? 9) - (priority[badgeB.text] ?? 9);
    });

  const upcomingCount = favoriteConcerts.filter(c => {
    const s = getStatusBadge(c.onSaleTime);
    return s.text !== '已开售';
  }).length;

  return (
    <div className="py-4 md:py-6 space-y-6 md:space-y-8 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-gradient-to-br from-accent-pink/10 via-bg-card to-accent-purple/10 border border-accent-pink/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-pink/20 rounded-full blur-3xl animate-pulse-fast" />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-accent-purple/20 rounded-full blur-3xl animate-float" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-pink/10 border border-accent-pink/30 text-accent-pink text-xs md:text-sm font-medium mb-3">
              <span>💝</span>
              <span>我的专属收藏夹</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-3">
              <span className="gradient-text">我的收藏</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-xl">
              已收藏 <span className="font-bold text-accent-pink text-lg">{favoriteConcerts.length}</span> 场演出，其中
              <span className="font-bold text-accent-orange mx-1">{upcomingCount}</span>场即将开票，别忘了定闹钟哦！
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm">
            <div className="p-3 md:p-4 rounded-2xl bg-bg-card/80 border border-border-dark text-center backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-accent-pink">{favoriteConcerts.length}</div>
              <div className="text-[10px] md:text-xs text-text-muted mt-1">总收藏</div>
            </div>
            <div className="p-3 md:p-4 rounded-2xl bg-bg-card/80 border border-border-dark text-center backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-accent-orange">{upcomingCount}</div>
              <div className="text-[10px] md:text-xs text-text-muted mt-1">待开票</div>
            </div>
            <div className="p-3 md:p-4 rounded-2xl bg-bg-card/80 border border-border-dark text-center backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-accent-green">
                {Math.max(0, favoriteConcerts.length - upcomingCount)}
              </div>
              <div className="text-[10px] md:text-xs text-text-muted mt-1">已开售</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      {favoriteConcerts.length > 0 && (
        <div className="card-glass p-4 md:p-5 border border-accent-yellow/20 bg-gradient-to-r from-accent-yellow/5 to-transparent">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-accent-yellow/10 border border-accent-yellow/30 flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
              💡
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="font-semibold text-text-primary text-sm md:text-base mb-1">开票提醒小技巧</div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                建议提前1-2天完成各购票平台的实名认证和观演人录入，并预存/充值支付方式。开票当天保持手机电量充足，5G网络优先！
              </p>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                ✅ 建议优先收藏「已官宣 confirmed」场次的演出，点击演出卡片进入详情页即可通过「核验直达」一键跳转官方售票页，实时查看余票状态。
              </p>
            </div>
            <Link
              to="/guides"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-bg-card border border-border-soft text-sm hover:border-accent-yellow/50 hover:text-accent-yellow transition-all flex-shrink-0"
            >
              <span>📖</span> 查看攻略
            </Link>
          </div>
        </div>
      )}

      {/* Data Notice */}
      <div className="data-notice">
        <div className="flex items-start gap-3">
          <div className="text-xl md:text-2xl flex-shrink-0">💝</div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <span className="font-bold text-orange-600 text-xs md:text-sm block">
              🚫 收藏列表为本地浏览器存储的静态快照，不包含实时余票/开售状态更新，请跳详情页点核验直达查看官方最新。
            </span>
            <span className="font-bold text-[#8a5a20] text-xs md:text-sm">
              收藏数据保存到本地浏览器 · 演出信息以官方最终公告为准
            </span>
            <p className="text-xs leading-relaxed text-[#7a4f1c]/90">
              ⚠️ {DATA_META.note} · 最后更新：{DATA_META.lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {favoriteConcerts.length > 0 ? (
        <div>
          <h2 className="section-title">
            <span>💝</span>
            <span>收藏的演出</span>
            <span className="text-sm md:text-base font-normal text-text-muted ml-2">
              （按开票紧急程度排序）
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {favoriteConcerts.map(concert => (
              <div key={concert.id} className="relative group">
                <ConcertCard concert={concert} />
                <button
                  onClick={() => removeFavorite(concert.id)}
                  className="absolute top-2 left-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 p-2 rounded-full bg-black/60 text-white/90 hover:bg-accent-pink hover:text-white backdrop-blur-sm z-10"
                  title="取消收藏"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Bulk actions */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border-dark">
            <div className="text-xs md:text-sm text-text-muted">
              共 {favoriteConcerts.length} 场收藏 · 数据自动保存到本地浏览器
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (confirm('确定要清空所有收藏吗？')) {
                    favoriteConcerts.forEach(c => removeFavorite(c.id));
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-accent-pink hover:bg-accent-pink/5 border border-transparent hover:border-accent-pink/30 transition-all"
              >
                清空全部收藏
              </button>
              <Link to="/search" className="btn-primary text-sm md:text-base">
                发现更多演出 →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="card-glass py-16 md:py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 via-transparent to-accent-purple/5" />
          <div className="relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-pink/10 to-accent-purple/10 border border-accent-pink/20 flex items-center justify-center animate-float">
              <span className="text-5xl md:text-7xl opacity-80">💝</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">收藏夹空空如也</h3>
            <p className="text-text-secondary text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
              看到心仪的演出，点击❤️收藏起来吧！<br />
              收藏的演出会集中在这里，并按开票时间排序提醒你～
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link to="/" className="btn-primary px-8 py-3.5 text-base">
                🏠 回到首页逛逛
              </Link>
              <Link to="/guides" className="btn-secondary px-8 py-3.5 text-base">
                📖 先看抢票攻略
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-border-dark max-w-3xl mx-auto">
              <div className="text-xs md:text-sm text-text-muted mb-5">🔥 大家都在收藏的热门演出</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {concerts.slice(0, 4).map(c => (
                  <Link
                    key={`rec-${c.id}`}
                    to={`/concert/${c.id}`}
                    className="p-3 md:p-4 rounded-2xl bg-bg-card/60 border border-border-dark hover:border-accent-pink/40 hover:bg-bg-card transition-all group text-left"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-[10px] md:text-xs text-accent-cyan font-semibold truncate">{c.artist}</div>
                    <div className="text-xs md:text-sm font-semibold text-text-primary line-clamp-1 truncate">
                      {c.title}
                    </div>
                    <div className="text-[10px] md:text-xs text-accent-pink font-bold mt-1">
                      {c.priceRange.split(' - ')[0]}起
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
