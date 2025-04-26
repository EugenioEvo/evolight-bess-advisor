
import React, { useState } from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import EvolightLogo from './EvolightLogo';
import SidebarMenu from './SidebarMenu';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className={`bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SidebarMenu onNavigate={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <EvolightLogo width={140} height={45} />
      </div>
      
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">Perfil</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
