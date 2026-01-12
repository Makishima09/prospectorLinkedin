import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, Settings, Linkedin } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: Home,
  },
  {
    to: '/leads',
    label: 'Leads',
    icon: Users,
  },
  {
    to: '/campaigns',
    label: 'Campañas',
    icon: FileText,
  },
  {
    to: '/settings',
    label: 'Configuración',
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Linkedin className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold">Prospector LinkedIn</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Usuario</p>
            <p className="text-xs text-muted-foreground">usuario@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
