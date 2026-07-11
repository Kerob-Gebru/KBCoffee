import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { translations, Language } from '../../i18n';
import { 
  Globe, LogOut, Menu, X, Bell, LayoutDashboard, Package, Gavel, 
  FileText, MessageSquare, ClipboardCheck, Truck, AlertTriangle, 
  TrendingUp, Settings 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { FloatingChat } from '../FloatingChat';
import { ToastContainer } from '../ui/ToastContainer';
import { AppNotification } from '../../types';

export function Layout() {
  const { currentUser, language, setLanguage, logout, notifications, setNotifications } = useStore();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const markNotificationsRead = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mock mark as read locally
      const updated = notifications.map(n => ({...n, read: true}));
      setNotifications(updated);
    }
  };

  React.useEffect(() => {
    if (!currentUser) return;
    
    // Mock fetching notifications
    const mockNotifications: AppNotification[] = [
      { id: '1', userId: currentUser.id, message: 'Welcome to KBCoffeeLink', read: false, createdAt: new Date().toISOString(), type: 'general' }
    ];
    setNotifications(mockNotifications);
    
  }, [currentUser]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <header className={`bg-white border-b border-slate-200 sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-navy flex items-center justify-center rounded-lg text-white font-bold text-sm">
                    KB
                  </div>
                  <span className="font-bold text-slate-900 text-lg hidden sm:block">KBCoffeeLink</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-navy transition-colors">
                  <Globe className="h-4 w-4" />
                  {language === 'en' ? 'አማርኛ' : 'EN'}
                </button>
                <div className="hidden sm:flex gap-2">
                  <Link to="/login">
                    <Button variant="ghost" className="text-slate-600">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-navy hover:bg-navy/90 text-white border-none shadow-sm rounded-lg">
                      Sign up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full">
          <Outlet />
        </main>
      </div>
    );
  }

  // Authenticated Layout (Sidebar)
  const sidebarLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ...(currentUser.role === 'Supplier' || currentUser.role === 'Admin' ? [{ label: 'My Lots', path: '/lots', icon: Package }] : []),
    { label: 'Bids', path: '/negotiations', icon: Gavel },
    { label: 'Contracts', path: '/contracts', icon: FileText },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    ...(currentUser.role === 'Inspector' || currentUser.role === 'Admin' ? [{ label: 'Quality Reports', path: '/quality', icon: ClipboardCheck }] : []),
    { label: 'Logistics', path: '/logistics', icon: Truck },
    { label: 'Disputes', path: '/disputes', icon: AlertTriangle },
    { label: 'Transactions', path: '/transactions', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-navy text-lg">
              KB
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight">KBCoffeeLink</div>
              <div className="text-[10px] text-slate-300">Ethiopian Coffee B2B</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-yellow-500 text-navy shadow-sm' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link 
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/profile'
                ? 'bg-yellow-500 text-navy shadow-sm' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className="h-5 w-5" />
            Profile
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-navy" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-sm font-medium text-slate-500">
              Welcome back, {currentUser.name}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={toggleLanguage} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy transition-colors">
              <span className="text-lg">文A</span>
              {language === 'en' ? 'አማርኛ' : 'EN'}
            </button>

            <div className="relative">
              <button 
                onClick={markNotificationsRead}
                className="relative text-slate-500 hover:text-navy transition-colors"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-lg">
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <p className="text-sm text-slate-800">{n.message}</p>
                              <span className="text-xs text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/80" onClick={() => setMobileMenuOpen(false)}></div>
          <aside className="relative w-64 max-w-sm bg-navy text-white flex flex-col h-full">
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
              <div className="font-bold text-lg">KBCoffeeLink</div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-yellow-500 text-navy shadow-sm' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <Link 
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/profile'
                    ? 'bg-yellow-500 text-navy shadow-sm' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5" />
                Profile
              </Link>
            </div>
          </aside>
        </div>
      )}

      <FloatingChat />
      <ToastContainer />
    </div>
  );
}

