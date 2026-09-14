import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-accent-purple/30">
              🎫
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold gradient-text">追星抢票助手</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: '首页' },
              { to: '/guides', label: '抢票攻略' },
              { to: '/search', label: '搜索' },
              { to: '/favorites', label: '我的收藏' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/search')}
              className="md:hidden p-2.5 rounded-xl bg-bg-card hover:bg-bg-card-hover transition-colors text-text-secondary hover:text-text-primary"
              aria-label="搜索"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              to="/favorites"
              className="p-2.5 rounded-xl bg-bg-card hover:bg-bg-card-hover transition-colors text-text-secondary hover:text-accent-pink"
              aria-label="我的收藏"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
