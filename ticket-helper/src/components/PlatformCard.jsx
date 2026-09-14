import { Link } from 'react-router-dom';

export default function PlatformCard({ platform }) {
  return (
    <div
      className={`card-glass card-hover p-4 md:p-5 border ${platform.borderColor} group cursor-pointer relative overflow-hidden`}
    >
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${platform.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
      
      <div className="relative flex items-start justify-between mb-3">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {platform.icon}
        </div>
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`p-2 rounded-lg bg-bg-dark/50 border ${platform.borderColor} ${platform.textColor} hover:scale-105 transition-transform`}
          aria-label="打开官网"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <Link to={`/guide/${platform.id}`} className="block relative">
        <h3 className={`text-lg md:text-xl font-bold mb-1 group-hover:${platform.textColor.replace('text-', '')} transition-colors`}>
          {platform.fullName}
        </h3>
        <p className="text-xs md:text-sm text-text-secondary mb-3 line-clamp-2">
          {platform.description}
        </p>
        
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold bg-gradient-to-r ${platform.color} text-white`}>
            查看抢票攻略
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </div>
  );
}
