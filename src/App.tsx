import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Backdrop from './components/Backdrop/Backdrop';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MailPicker from './components/MailPicker/MailPicker';
import { IntroPhaseContext, type IntroPhase } from './components/Intro/IntroPhaseContext';
import { isIntroPending } from './components/Intro/introGate';
import Home from './pages/Home';
import Terms from './pages/Terms';
import NotFound from './pages/404';
import { useLanguage, useLanguageSync } from './hooks/useLanguage';
import { prefersReducedMotion, usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useTypewriter } from './hooks/useTypewriter';
import { DEFAULT_LANGUAGE } from './utils/i18n';
import './App.css';

const Snowfall = lazy(() => import('react-snowfall')); // own chunk: only downloaded when it snows
const Intro = lazy(() => import('./components/Intro/Intro')); // own chunk: only downloaded when the intro plays

const TITLES = ['Hello World!', 'Maybe Claude is better...', 'Junior Dev', 'Student'];

function DocumentTitle() {
  const title = useTypewriter(TITLES, 550, 220, 3000);

  useEffect(() => {
    document.title = `faydonk.dev | ${title}`;
  }, [title]);

  return null;
}

const snowOverride = (): boolean | null => {
  const local = import.meta.env.DEV || ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname); // ?snow=1 / ?snow=0: dev and localhost only
  if (!local) return null;
  const value = new URLSearchParams(window.location.search).get('snow');
  return value === '1' ? true : value === '0' ? false : null;
};

function SeasonalSnow() {
  const reducedMotion = usePrefersReducedMotion();
  const [override] = useState(snowOverride); // read once: stays on while browsing
  const isDecember = new Date().getMonth() === 11;

  if (!(override ?? (isDecember && !reducedMotion))) return null;

  return (
    <Suspense fallback={null}>
      <Snowfall style={{ position: 'fixed', zIndex: 9999 }} />
    </Suspense>
  );
}

function useScrollOnNavigate(introPlaying: boolean) {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (introPlaying) return;
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key, introPlaying]);
}

function LangLayout() {
  const { currentLanguage, isSupported } = useLanguage();
  const pageRef = useRef<HTMLDivElement>(null);
  const [introPlaying, setIntroPlaying] = useState(isIntroPending);
  const [phase, setPhase] = useState<IntroPhase>(() =>
    isIntroPending() && !prefersReducedMotion() ? 'pending' : 'live' // reduced motion: plain fade, the hero isn't held back
  );
  const endIntro = useCallback(() => {
    setPhase('live');
    setIntroPlaying(false);
  }, []);

  useLanguageSync(currentLanguage);
  useScrollOnNavigate(introPlaying);

  return (
    <IntroPhaseContext.Provider value={phase}>
      <MailPicker ready={!introPlaying}>
        <div className="site">
          <Backdrop />
          <div ref={pageRef} className="site__content">
            <Header />
            <main>{isSupported ? <Outlet /> : <NotFound />}</main>
            <Footer />
          </div>
          {introPlaying && (
            <Suspense fallback={<div className="intro-cover" aria-hidden="true" />}>
              <Intro pageRef={pageRef} onPhase={setPhase} onDone={endIntro} />
            </Suspense>
          )}
        </div>
      </MailPicker>
    </IntroPhaseContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DocumentTitle />
      <SeasonalSnow />
      <Routes>
        <Route index element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
        <Route path=":lang" element={<LangLayout />}>
          <Route index element={<Home />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
