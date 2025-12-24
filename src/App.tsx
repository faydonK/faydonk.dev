import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import NotFound from './pages/404';
import './utils/i18n';
import './App.css';

function AppContent() {
  // const [isLoading, setIsLoading] = useState(false);
  const [currentTitles, setCurrentTitle] = useState('Hello World!');
  const [showSnowfall, setShowSnowfall] = useState(false);
  const location = useLocation();
  
  // Le hook gère automatiquement la langue
  useLanguage();

  const titles = [
    'Hello World!',
    'Junior Dev'
  ];

  const currentTitle = useTypewriter(titles, 550, 220, 3000);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [location.pathname]);

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

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <>
      {showSnowfall && <Snowfall style={{ position: 'fixed', zIndex: 9999 }} />}
      <Header />
      <Routes>
        <Route path="/:lang" element={
          <div className="app">
            <div style={{ height: '71px' }}></div>
            <Hero />
            <About />
            <div className="section-divider"></div>
            <Skills />
            <div className="section-divider"></div>
            <Projects />
            <Footer />
          </div>
        } />
        <Route path="/:lang/terms" element={<Terms />} />
        <Route path="/" element={<Navigate to="/en" replace />} />
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