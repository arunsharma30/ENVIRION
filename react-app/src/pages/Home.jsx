import { useEffect } from 'react';
import '../styles/index.css';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PartnersStrip from '../components/PartnersStrip';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import About from '../components/About';
import CtaBanner from '../components/CtaBanner';
import Footer from '../components/Footer';

export default function Home() {
  useEffect(() => {
    // Scroll reveal animations with IntersectionObserver — EXACT logic from index.js
    const revealEls = document.querySelectorAll('.reveal');

    function triggerReveal(el, delay) {
      setTimeout(() => el.classList.add('visible'), delay || 0);
    }

    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            triggerReveal(entry.target, i * 80);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(el => observer.observe(el));
    } else {
      // Fallback for browsers without IntersectionObserver
      revealEls.forEach(el => el.classList.add('visible'));
    }

    // Safety: reveal all after 1.5s if observer hasn't fired (file:// etc.)
    const safetyTimer = setTimeout(() => revealEls.forEach(el => el.classList.add('visible')), 1500);

    return () => {
      clearTimeout(safetyTimer);
      if (observer) {
        revealEls.forEach(el => observer.unobserve(el));
        observer.disconnect();
      }
    };
  }, []);

  // Reset body styles for landing page
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.background = '';
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <PartnersStrip />
      <HowItWorks />
      <Features />
      <About />
      <CtaBanner />
      <Footer />
    </>
  );
}
