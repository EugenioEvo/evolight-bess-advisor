
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvolightLogo from './EvolightLogo';
import { hasOnboarded } from '@/lib/utils';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user has been onboarded before
    const isOnboarded = hasOnboarded();
    
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        // Navigate to onboarding or home based on whether user has completed onboarding
        navigate(isOnboarded ? '/home' : '/onboarding');
      }, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col items-center">
        <EvolightLogo width={240} height={120} />
        <div className="mt-8">
          <div className="w-12 h-1 bg-evolight-gold animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
