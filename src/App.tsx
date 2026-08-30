import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import { useTypewriter } from './hooks/useTypewriter';
import { useLanguage } from './hooks/useLanguage';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Footer from './components/Footer/Footer';
// import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Terms from './pages/Terms';
import Lab from './pages/Lab';
import NotFound from './pages/404';
import './utils/i18n';
import './App.css';


function LangLayout() {
  useLanguage();

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function HomePage() {
  return (
    <div className="app">
      <Hero />
      <About />
      <div className="section-divider"></div>
      <Skills />
      <div className="section-divider"></div>
      <Projects />
      <Footer />
    </div>
  );
}

function AppContent() {
  const [showSnowfall, setShowSnowfall] = useState(false);

  const titles = [
    'Hello World!',
    'Maybe Claude is better...',
    'Junior Dev',
    'Student'
  ];

  const currentTitle = useTypewriter(titles, 550, 220, 3000);

  useEffect(() => {
    document.title = `faydonk.dev | ${currentTitle}`;
  }, [currentTitle]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    if (currentMonth === 11) {
      setShowSnowfall(true);
    }
  }, []);

  return (
    <>
      {showSnowfall && <Snowfall style={{ position: 'fixed', zIndex: 9999 }} />}
      <Routes>
        <Route path="/lab" element={<Lab />} />
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:lang" element={<LangLayout />}>
          <Route index element={<HomePage />} />
          <Route path="terms" element={<Terms />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
