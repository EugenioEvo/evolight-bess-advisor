
import React from 'react';

interface EvolightLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const EvolightLogo: React.FC<EvolightLogoProps> = ({ className, width = 180, height = 80 }) => {
  return (
    <img 
      src="/lovable-uploads/b7404c96-b1f9-49ee-a3f5-aa2a0696d688.png" 
      alt="Evolight Logo" 
      className={className} 
      style={{ width, height, objectFit: 'contain' }}
    />
  );
};

export default EvolightLogo;
