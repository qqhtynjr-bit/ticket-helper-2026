import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import MobileTabBar from './components/MobileTabBar.jsx';
import Home from './pages/Home.jsx';
import ConcertDetail from './pages/ConcertDetail.jsx';
import GuideList from './pages/GuideList.jsx';
import GuideDetail from './pages/GuideDetail.jsx';
import Search from './pages/Search.jsx';
import Favorites from './pages/Favorites.jsx';
import { FavoritesProvider } from './hooks/useFavorites.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PagesRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    try {
      const url = new URL(window.location.href);
      const p = url.searchParams.get('p');
      const stored = sessionStorage.getItem('spa-redirect');
      if (stored) {
        sessionStorage.removeItem('spa-redirect');
        const dest = stored.replace(/^\.?\//, '/');
        setDone(true);
        navigate(dest, { replace: true });
        return;
      }
      if (p) {
        const dest = p.replace(/^\.?\//, '/');
        setDone(true);
        navigate(dest, { replace: true });
        return;
      }
    } catch (e) {
      /* ignore */
    }
    setDone(true);
  }, [done, navigate]);

  return done ? null : (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b7355' }}>
      <div style={{ fontSize: 14 }}>⏳ 正在加载路由…</div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/guide/') || location.pathname.startsWith('/concert/');

  return (
    <FavoritesProvider>
      <ScrollToTop />
      <PagesRedirect />
      <div className="min-h-screen pb-24 md:pb-8">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index.html" element={<Home />} />
            <Route path="/concert/:id" element={<ConcertDetail />} />
            <Route path="/guides" element={<GuideList />} />
            <Route path="/guide/:platformId" element={<GuideDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        {!hideNav && <MobileTabBar />}
      </div>
    </FavoritesProvider>
  );
}

export default App;
