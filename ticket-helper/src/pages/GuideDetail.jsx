import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPlatformById, platformList } from '../data/platforms.js';

export default function GuideDetail() {
  const { platformId } = useParams();
  const navigate = useNavigate();
  const platform = getPlatformById(platformId);

  if (!platform) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">📖</div>
        <h2 className="text-2xl font-bold mb-2">未找到该攻略</h2>
        <p className="text-text-secondary mb-6">平台信息不存在</p>
        <button onClick={() => navigate('/guides')} className="btn-primary">
          返回攻略列表
        </button>
      </div>
    );
  }

  const tips = platform.tips;
  const currentIndex = platformList.findIndex(p => p.id === platformId);
  const prevPlatform = platformList[(currentIndex - 1 + platformList.length) % platformList.length];
  const nextPlatform = platformList[(currentIndex + 1) % platformList.length];

  const tipIcons = {
    register: '📝',
    queue: '🏃',
    payment: '💳',
    leak: '🎁',
  };

  return (
    <div className="py-4 md:py-6 space-y-6 pb-8">
      {/* Back */}
      <button
        onClick={() => navigate('/guides')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card/50 text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回攻略列表
      </button>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-20`} />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        
        <div className={`relative p-6 md:p-10 lg:p-12 border-2 ${platform.borderColor} rounded-3xl bg-bg-card/80 backdrop-blur-xl`}>
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-5xl md:text-7xl shadow-2xl flex-shrink-0 animate-float`}>
              {platform.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold">
                  <span className="gradient-text">{platform.fullName}</span>
                  <span className="text-text-primary text-xl md:text-3xl ml-2">抢票攻略</span>
                </h1>
              </div>
              <p className="text-text-secondary text-sm md:text-lg mb-5 max-w-2xl">{platform.description}</p>
              
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r ${platform.color} text-white font-bold text-sm md:text-base hover:shadow-xl hover:shadow-current/40 hover:scale-105 transition-all active:scale-95`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  立即前往官网
                </a>
                <div className={`hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${platform.bgColor} border ${platform.borderColor} text-sm`}>
                  <span className={platform.textColor}>攻略指数</span>
                  <span className="font-bold text-white">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="card-glass p-4 md:p-5">
        <div className="text-xs text-text-muted mb-3">📑 快速导航</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {Object.entries(tips).map(([key, tip]) => (
            <a
              key={key}
              href={`#section-${key}`}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl ${platform.bgColor} border ${platform.borderColor} hover:scale-[1.03] transition-transform text-sm md:text-base`}
            >
              <span>{tipIcons[key]}</span>
              <span className={`font-semibold ${platform.textColor}`}>{tip.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Tips Sections */}
      <div className="space-y-6 md:space-y-8">
        {Object.entries(tips).map(([key, tip], sectionIdx) => (
          <div
            key={key}
            id={`section-${key}`}
            className="scroll-mt-24"
          >
            <div className={`card-glass overflow-hidden border-2 ${platform.borderColor} relative`}>
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${platform.color}`} />
              
              <div className={`p-5 md:p-7 lg:p-8 border-b ${platform.borderColor} bg-gradient-to-r ${platform.bgColor} to-transparent`}>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl md:text-4xl shadow-lg`}>
                    {tipIcons[key]}
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-text-muted mb-1">
                      第 {sectionIdx + 1} 步 / 共 4 步
                    </div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold">
                      <span className={platform.textColor}>{tip.title}</span>
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-7 lg:p-8">
                <ol className="space-y-3 md:space-y-4">
                  {tip.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-bg-card/50 border border-border-dark hover:border-accent-purple/30 hover:bg-bg-card transition-all duration-200 group"
                    >
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-sm md:text-base font-bold flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                        {idx + 1}
                      </div>
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed pt-1.5 md:pt-2">
                        {item}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className={`card-glass p-5 md:p-8 lg:p-10 border-2 ${platform.borderColor} bg-gradient-to-br from-bg-card via-accent-purple/5 to-bg-card relative overflow-hidden`}>
        <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${platform.color} opacity-10 blur-3xl`} />
        <div className="relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 border border-accent-yellow/30 text-accent-yellow text-sm md:text-base font-semibold mb-3">
              ⚠️ 划重点总结
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold">
              <span className={platform.textColor}>{platform.name}</span>
              <span className="text-text-primary">抢票必胜口诀</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            <div className="p-4 md:p-5 rounded-2xl bg-bg-card/70 border border-border-dark">
              <div className={`text-2xl md:text-3xl font-extrabold ${platform.textColor} mb-1`}>预</div>
              <div className="text-xs md:text-sm text-text-secondary">提前实名不慌乱</div>
            </div>
            <div className="p-4 md:p-5 rounded-2xl bg-bg-card/70 border border-border-dark">
              <div className={`text-2xl md:text-3xl font-extrabold ${platform.textColor} mb-1`}>稳</div>
              <div className="text-xs md:text-sm text-text-secondary">排队耐心莫刷新</div>
            </div>
            <div className="p-4 md:p-5 rounded-2xl bg-bg-card/70 border border-border-dark">
              <div className={`text-2xl md:text-3xl font-extrabold ${platform.textColor} mb-1`}>快</div>
              <div className="text-xs md:text-sm text-text-secondary">支付免密要先行</div>
            </div>
            <div className="p-4 md:p-5 rounded-2xl bg-bg-card/70 border border-border-dark">
              <div className={`text-2xl md:text-3xl font-extrabold ${platform.textColor} mb-1`}>守</div>
              <div className="text-xs md:text-sm text-text-secondary">回流门票蹲得住</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next Navigation */}
      <div className="grid sm:grid-cols-2 gap-4 pt-4">
        <Link
          to={`/guide/${prevPlatform.id}`}
          className={`card-glass card-hover p-4 md:p-5 flex items-center gap-4 border ${prevPlatform.borderColor}`}
        >
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${prevPlatform.color} flex items-center justify-center text-2xl md:text-3xl flex-shrink-0`}>
            {prevPlatform.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一篇攻略
            </div>
            <div className="font-semibold text-sm md:text-base text-text-primary truncate">
              {prevPlatform.fullName}抢票攻略
            </div>
          </div>
        </Link>
        <Link
          to={`/guide/${nextPlatform.id}`}
          className={`card-glass card-hover p-4 md:p-5 flex items-center gap-4 border ${nextPlatform.borderColor} sm:flex-row-reverse sm:text-right`}
        >
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${nextPlatform.color} flex items-center justify-center text-2xl md:text-3xl flex-shrink-0`}>
            {nextPlatform.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-text-muted mb-1 flex items-center gap-1 sm:justify-end">
              下一篇攻略
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="font-semibold text-sm md:text-base text-text-primary truncate">
              {nextPlatform.fullName}抢票攻略
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
