
import React from 'react';

export function FooterSection() {
  return (
    <footer className="bg-white py-4 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Evolight Energia Inovadora. Todos os direitos reservados.
      </div>
    </footer>
  );
}
