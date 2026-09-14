import { Link } from 'react-router-dom';
import { platformList } from '../data/platforms.js';

export default function GuideList() {
  return (
    <div className="py-4 md:py-6 space-y-8 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-gradient-to-br from-bg-card via-bg-card/80 to-bg-card border border-border-dark">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-xs md:text-sm font-medium mb-4">
            <span>📚</span>
            <span>抢票必备 · 保姆级攻略</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-4">
            <span className="gradient-text">6大平台抢票攻略大全</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-lg max-w-2xl leading-relaxed">
            从注册、排队、支付到捡漏，每一个环节的实战技巧都在这里。收藏好，开票前必读！
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
            {[
              { icon: '📝', title: '注册要求', desc: '实名认证·观演人' },
              { icon: '🏃', title: '排队技巧', desc: '提前占位·稳操作' },
              { icon: '💳', title: '支付建议', desc: '免密·余额·通道' },
              { icon: '🎁', title: '捡漏技巧', desc: '回流票·放票点' },
            ].map(item => (
              <div key={item.title} className="p-3 md:p-4 rounded-2xl bg-bg-card/60 border border-border-dark">
                <div className="text-2xl md:text-3xl mb-1">{item.icon}</div>
                <div className="font-semibold text-sm md:text-base text-text-primary">{item.title}</div>
                <div className="text-[10px] md:text-xs text-text-muted mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div>
        <h2 className="section-title">
          <span>🎫</span> 选择平台查看攻略
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {platformList.map(platform => (
            <Link
              key={platform.id}
              to={`/guide/${platform.id}`}
              className={`card-glass card-hover group relative overflow-hidden border-2 ${platform.borderColor}`}
            >
              <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${platform.color} opacity-15 blur-3xl group-hover:opacity-25 transition-opacity duration-500`} />
              
              <div className="relative p-5 md:p-7 flex flex-col md:flex-row gap-5 md:gap-7">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-4xl md:text-5xl shadow-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {platform.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-extrabold mb-1 group-hover:gradient-text transition-all duration-300">
                        {platform.fullName}
                      </h3>
                      <p className="text-text-secondary text-sm md:text-base">{platform.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
                    {Object.entries(platform.tips).map(([key, tip]) => (
                      <div key={key} className={`p-2.5 md:p-3 rounded-xl ${platform.bgColor} border ${platform.borderColor}`}>
                        <div className={`text-xs md:text-sm font-bold ${platform.textColor} mb-1`}>
                          {key === 'register' && '📝'}
                          {key === 'queue' && '🏃'}
                          {key === 'payment' && '💳'}
                          {key === 'leak' && '🎁'}
                          {' '}{tip.title}
                        </div>
                        <div className="text-[10px] md:text-xs text-text-muted">
                          {tip.items.length} 条核心技巧
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${platform.color} text-white font-semibold text-sm group-hover:shadow-lg group-hover:shadow-current/30 transition-all`}>
                      查看完整攻略
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs md:text-sm ${platform.textColor} hover:underline flex items-center gap-1`}
                    >
                      前往官网
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="card-glass p-5 md:p-8 border border-accent-pink/20 bg-gradient-to-br from-accent-pink/5 via-transparent to-accent-purple/5">
        <h2 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2">
          <span className="text-2xl">💡</span> 抢票通用心得
        </h2>
        <div className="grid md:grid-cols-2 gap-5 text-sm md:text-base">
          {[
            {
              title: '🔐 账号准备',
              items: [
                '提前1-2天完成所有平台的实名注册和观演人录入',
                '建议2-3个账号同时操作（家人/朋友的号）',
                '保持账号活跃，避免被判定为机器人',
              ]
            },
            {
              title: '📱 设备网络',
              items: [
                '5G/4G优先，WiFi容易被挤掉线',
                '关闭VPN/代理，使用运营商原生网络',
                '手机+平板同时登录，多一份机会',
              ]
            },
            {
              title: '⏰ 时间策略',
              items: [
                '开票前5-10分钟进入页面，不要太早',
                '卡顿时不要频繁刷新，耐心等待',
                '开票后1小时、3小时、24小时是捡漏好时机',
              ]
            },
            {
              title: '💡 其他建议',
              items: [
                '提前和同行朋友商量好票价档位',
                '设置好免密支付并确保余额充足',
                '开票当天保持手机电量80%+',
              ]
            },
          ].map(section => (
            <div key={section.title} className="p-4 md:p-5 rounded-2xl bg-bg-card/50 border border-border-dark">
              <div className="font-bold text-text-primary mb-3">{section.title}</div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary">
                    <span className="text-accent-pink mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
