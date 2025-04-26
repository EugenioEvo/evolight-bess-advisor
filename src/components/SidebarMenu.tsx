
import React from 'react';
import { Link } from 'react-router-dom';
import EvolightLogo from './EvolightLogo';
import { Home, FileText, BookOpen, Info, Grid } from 'lucide-react';

interface SidebarMenuProps {
  onNavigate?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onNavigate }) => {
  const menuItems = [
    {
      title: 'Início',
      icon: <Home className="h-5 w-5" />,
      path: '/home',
    },
    {
      title: 'Simulador BESS',
      icon: <Grid className="h-5 w-5" />,
      path: '/simulador',
    },
    {
      title: 'Documentação Técnica',
      icon: <FileText className="h-5 w-5" />,
      path: '/documentacao',
    },
    {
      title: 'Academia da Sustentabilidade',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/academia',
    },
    {
      title: 'Sobre a Evolight',
      icon: <Info className="h-5 w-5" />,
      path: '/sobre',
    },
  ];

  return (
    <div className="h-full flex flex-col py-4">
      <div className="px-6 mb-6">
        <EvolightLogo width={130} height={50} />
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-evolight-lightgray hover:text-evolight-navy transition-colors"
                onClick={onNavigate}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-4 py-6 border-t border-gray-200 mt-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-evolight-gold flex items-center justify-center text-white font-medium">
            E
          </div>
          <div>
            <p className="text-sm font-medium">Evolight Energia</p>
            <p className="text-xs text-gray-500">energia inovadora</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
