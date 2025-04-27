
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import EvolightLogo from './EvolightLogo';
import { Home, FileText, BookOpen, Info, Grid, Settings } from 'lucide-react';

interface SidebarMenuProps {
  onNavigate?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onNavigate }) => {
  const location = useLocation();
  
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
    {
      title: 'Configurações',
      icon: <Settings className="h-5 w-5" />,
      path: '/configuracoes',
      disabled: true,
    },
  ];

  return (
    <div className="h-full flex flex-col py-4">
      <div className="px-6 mb-6">
        <EvolightLogo width={130} height={50} />
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
            <li key={item.path}>
              <Link
                to={item.disabled ? '#' : item.path}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-evolight-navy/10 text-evolight-navy' 
                    : 'hover:bg-evolight-lightgray hover:text-evolight-navy'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={item.disabled ? (e) => e.preventDefault() : onNavigate}
              >
                <span className={`mr-3 ${isActive ? 'text-evolight-navy' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.title}
                {item.disabled && <span className="ml-auto text-xs bg-gray-200 px-1.5 py-0.5 rounded">Em breve</span>}
              </Link>
            </li>
          )})}
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
