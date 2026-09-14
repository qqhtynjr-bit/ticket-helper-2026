import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ compact = false, initialValue = '' }) {
  const [keyword, setKeyword] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const hotKeywords = ['周杰伦', '上海', '五月天', '北京', '薛之谦', '成都'];

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`relative flex items-center bg-bg-card/50 rounded-2xl border transition-all duration-300 ${
          focused ? 'border-accent-purple ring-4 ring-accent-purple/10' : 'border-border-dark'
        }`}>
          <div className="pl-4 pr-2 text-text-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="搜索艺人、城市..."
            className="flex-1 py-3 pr-4 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
          />
          <button
            type="submit"
            className="hidden sm:block mx-2 px-5 py-2 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-pink/30 transition-all"
          >
            搜索
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`relative flex items-center bg-bg-card/80 backdrop-blur-xl rounded-3xl border-2 transition-all duration-300 shadow-2xl ${
          focused ? 'border-accent-purple shadow-accent-purple/20' : 'border-border-dark'
        }`}>
          <div className="pl-5 pr-3 text-text-muted">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="搜索艺人名字或演出城市，如：周杰伦 / 上海"
            className="flex-1 py-4 md:py-5 pr-4 bg-transparent outline-none text-base md:text-lg text-text-primary placeholder:text-text-muted"
          />
          <button
            type="submit"
            className="m-2 md:m-3 px-5 md:px-8 py-2.5 md:py-3 rounded-2xl bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue text-white font-semibold text-sm md:text-base hover:shadow-lg hover:shadow-accent-pink/40 hover:scale-105 transition-all active:scale-95 whitespace-nowrap"
          >
            抢票搜索
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted mr-1">🔥 热门搜索：</span>
        {hotKeywords.map(kw => (
          <button
            key={kw}
            onClick={() => {
              setKeyword(kw);
              navigate(`/search?q=${encodeURIComponent(kw)}`);
            }}
            className="px-3 py-1.5 rounded-full bg-bg-card/50 border border-border-dark text-xs md:text-sm text-text-secondary hover:border-accent-pink/50 hover:text-accent-pink hover:bg-accent-pink/5 transition-all duration-200"
          >
            {kw}
          </button>
        ))}
      </div>
    </div>
  );
}
