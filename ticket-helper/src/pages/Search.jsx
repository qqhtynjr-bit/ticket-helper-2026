import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ConcertCard from '../components/ConcertCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { concerts, DATA_META } from '../data/concerts.js';
import { filterConcerts, sortConcerts, getAllCities } from '../utils/helpers.js';

const sortOptions = [
  { value: 'onSaleAsc', label: '开票时间↑（近→远）', desc: '最近开票优先' },
  { value: 'onSaleDesc', label: '开票时间↓（远→近）', desc: '最久开票优先' },
  { value: 'dateAsc', label: '演出时间↑（近→远）', desc: '最近开演优先' },
  { value: 'dateDesc', label: '演出时间↓（远→近）', desc: '最远开演优先' },
  { value: 'priceLow', label: '票价↑（低→高）', desc: '最便宜优先' },
  { value: 'priceHigh', label: '票价↓（高→低）', desc: '最贵优先' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'onSaleAsc';
  const initialCity = searchParams.get('city') || 'all';

  const [keyword, setKeyword] = useState(initialQ);
  const [sortType, setSortType] = useState(initialSort);
  const [city, setCity] = useState(initialCity);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  const cities = useMemo(() => getAllCities(concerts), []);

  useEffect(() => {
    setKeyword(initialQ);
  }, [initialQ]);

  const filtered = useMemo(() => {
    let result = filterConcerts(concerts, { keyword, city });
    result = sortConcerts(result, sortType);
    return result;
  }, [keyword, city, sortType]);

  const afterStatus = useMemo(() => {
    if (!filterStatus || filterStatus === 'all') return filtered;
    return filtered.filter(c => c.status === filterStatus);
  }, [filtered, filterStatus]);

  const allCount = filtered.length;
  const confirmedCount = filtered.filter(c => c.status === 'confirmed').length;
  const rumoredCount = filtered.filter(c => c.status === 'rumored').length;

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'onSaleAsc') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSortChange = (val) => {
    setSortType(val);
    updateParams({ sort: val });
  };

  const handleCityChange = (val) => {
    setCity(val);
    updateParams({ city: val });
  };

  const handleKeywordSearch = (val) => {
    setKeyword(val);
    updateParams({ q: val });
  };

  const activeFilterCount =
    (city !== 'all' ? 1 : 0) +
    (keyword ? 1 : 0);

  return (
    <div className="py-4 md:py-6 space-y-6 pb-8">
      {/* Header Search */}
      <div className="relative">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6">
          <span className="gradient-text">搜索演唱会</span>
        </h1>
        <SearchBar compact initialValue={keyword} />
      </div>

      {/* Filters Bar */}
      <div className="card-glass p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
          {/* Sort */}
          <div className="flex-1 md:max-w-xs">
            <label className="block text-xs text-text-muted mb-1.5">排序方式</label>
            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none bg-bg-card border border-border-dark rounded-xl px-4 py-3 pr-10 text-sm text-text-primary focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition-all cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* City */}
          <div className="flex-1 md:max-w-xs">
            <label className="block text-xs text-text-muted mb-1.5">城市筛选</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full appearance-none bg-bg-card border border-border-dark rounded-xl px-4 py-3 pr-10 text-sm text-text-primary focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition-all cursor-pointer"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c === 'all' ? '全部城市' : c}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Mobile filter toggle */}
          <div className="md:hidden flex items-center justify-between pt-2 border-t border-border-dark">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card border border-border-dark text-sm"
            >
              <span>更多筛选</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent-pink text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
              <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {(activeFilterCount > 0 || keyword) && (
              <button
                onClick={() => {
                  setKeyword('');
                  setCity('all');
                  setSortType('onSaleAsc');
                  setSearchParams({});
                }}
                className="px-4 py-2.5 rounded-xl text-sm text-accent-pink hover:bg-accent-pink/10 transition-colors"
              >
                重置
              </button>
            )}
          </div>

          {/* Desktop reset */}
          <div className="hidden md:flex items-center gap-2 pt-6">
            {(activeFilterCount > 0 || keyword) && (
              <button
                onClick={() => {
                  setKeyword('');
                  setCity('all');
                  setSortType('onSaleAsc');
                  setSearchParams({});
                }}
                className="px-4 py-3 rounded-xl text-sm text-accent-pink bg-accent-pink/5 border border-accent-pink/20 hover:bg-accent-pink/10 transition-all"
              >
                ✕ 清除筛选
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Tags */}
        {(keyword || city !== 'all') && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-border-dark">
            <span className="text-xs text-text-muted mr-1">已选筛选：</span>
            {keyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/30 text-xs">
                🔍 关键词「{keyword}」
                <button
                  onClick={() => { setKeyword(''); updateParams({ q: '' }); }}
                  className="hover:scale-110 transition-transform"
                >✕</button>
              </span>
            )}
            {city !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/30 text-xs">
                📍 {city}
                <button
                  onClick={() => { setCity('all'); updateParams({ city: 'all' }); }}
                  className="hover:scale-110 transition-transform"
                >✕</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          找到 <span className="font-bold text-accent-pink text-base mx-1">{afterStatus.length}</span> 场相关演出
          {sortOptions.find(s => s.value === sortType) && (
            <span className="text-text-muted ml-2 hidden sm:inline">
              · 按{sortOptions.find(s => s.value === sortType).desc}
            </span>
          )}
        </div>
      </div>

      {/* Status Chip Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterStatus(null)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            !filterStatus || filterStatus === 'all'
              ? 'bg-accent-pink text-white border-accent-pink shadow-lg shadow-accent-pink/20'
              : 'bg-bg-card text-text-secondary border-border-dark hover:border-accent-pink/50 hover:text-accent-pink'
          }`}
        >
          <span>全部</span>
          <span className="opacity-80">{allCount}</span>
        </button>
        <button
          onClick={() => setFilterStatus('confirmed')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            filterStatus === 'confirmed'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-bg-card text-text-secondary border-border-dark hover:border-emerald-500/50 hover:text-emerald-500'
          }`}
        >
          <span>✅</span>
          <span>confirmed</span>
          <span className="opacity-80">{confirmedCount}场</span>
        </button>
        <button
          onClick={() => setFilterStatus('rumored')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            filterStatus === 'rumored'
              ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20'
              : 'bg-bg-card text-text-secondary border-border-dark hover:border-amber-500/50 hover:text-amber-500'
          }`}
        >
          <span>⚠️</span>
          <span>rumored</span>
          <span className="opacity-80">{rumoredCount}</span>
        </button>
      </div>

      {/* Data Notice */}
      <div className="data-notice">
        <div className="flex items-start gap-3">
          <div className="text-xl md:text-2xl flex-shrink-0">📢</div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#8a5a20] text-xs md:text-sm">
                搜索结果仅供参考 · 最后更新：{DATA_META.lastUpdated}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#7a4f1c]/90">
              ⚠️ {DATA_META.note} 请前往官方平台核验最终信息：
              {DATA_META.verifyChannels.map(channel => {
                const idx = channel.indexOf('：');
                const name = idx > 0 ? channel.slice(0, idx) : channel;
                const url = idx > 0 ? channel.slice(idx + 1) : '';
                return (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mx-1 underline decoration-dotted hover:decoration-solid font-medium"
                  >
                    {name.replace('网', '').split(' ')[0]}网
                  </a>
                );
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {afterStatus.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {afterStatus.map(concert => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      ) : (
        <div className="card-glass py-16 md:py-24 text-center">
          <div className="text-6xl md:text-7xl mb-5 opacity-60">🔍</div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">没有找到相关演出</h3>
          <p className="text-text-secondary text-sm md:text-base mb-6 max-w-md mx-auto">
            试试换个关键词或清除筛选条件，也许会有惊喜哦～
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setKeyword(''); setCity('all'); setSortType('onSaleAsc'); setSearchParams({});
              }}
              className="btn-primary"
            >
              查看全部演出
            </button>
            <Link to="/guides" className="btn-secondary">
              先看抢票攻略 →
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-border-dark max-w-2xl mx-auto">
            <div className="text-sm text-text-muted mb-4">💡 试试这些热门搜索</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['周杰伦', '五月天', '上海', '北京', '薛之谦', '成都'].map(kw => (
                <button
                  key={kw}
                  onClick={() => { setKeyword(kw); updateParams({ q: kw }); }}
                  className="px-4 py-2 rounded-full bg-bg-card border border-border-dark text-sm text-text-secondary hover:border-accent-pink/50 hover:text-accent-pink hover:bg-accent-pink/5 transition-all"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
