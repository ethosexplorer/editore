import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import PersonaSection from '../components/PersonaSection';
import VideoSection from '../components/VideoSection';
import TestimonialsSection from '../components/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PersonaSection />
      <VideoSection />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;