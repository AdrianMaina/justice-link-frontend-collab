import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Menu, X, AlertTriangle, Globe, Settings, LogIn, UserPlus, FileText } from 'lucide-react';
import { Button } from './ui/Button';

export default function Navigation({ activeSection, setActiveSection }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const navItems = [
        { id: 'home', label: 'Nyumbani', icon: Shield },
        { id: 'report', label: 'Ripoti Tukio', icon: AlertTriangle, requiresAuth: true },
        { id: 'my-reports', label: 'Ripoti Zangu', icon: FileText, requiresAuth: true },
        { id: 'news', label: 'Habari', icon: Globe },
        { id: 'admin', label: 'Msimamizi', icon: Settings, requiresAuth: true, adminOnly: true }
    ];

    const filteredNavItems = navItems.filter(item => {
        if (item.requiresAuth && !isAuthenticated) return false;
        if (item.adminOnly && (!user || !user.is_admin)) return false;
        return true;
    });

    const handleLogout = () => {
        logout();
        setActiveSection('home');
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-primary via-destructive to-secondary shadow-lg sticky top-0 z-50 border-b-4 border-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('home')}>
                        <Shield className="h-8 w-8 text-white" />
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white">JUSTICE LINK KENYA 🇰🇪</h1>
                            <p className="hidden md:block text-xs text-green-200">Sauti dhidi ya ukatili wa polisi Kenya</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center space-x-1">
                        {filteredNavItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeSection === item.id ? "secondary" : "ghost"}
                                className={`flex items-center gap-2 text-white hover:bg-white/20 ${
                                    activeSection === item.id ? 'bg-white text-black' : ''
                                }`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                        {!isAuthenticated ? (
                            <>
                                <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setActiveSection('login')}><LogIn className="mr-2 h-4 w-4" /> Ingia</Button>
                                <Button variant="secondary" className="bg-white text-black" onClick={() => setActiveSection('signup')}><UserPlus className="mr-2 h-4 w-4" /> Jisajili</Button>
                            </>
                        ) : (
                            <Button variant="destructive" className="ml-2" onClick={handleLogout}>Toka</Button>
                        )}
                    </div>
                    <div className="lg:hidden flex items-center">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-white/20">
                        <div className="flex flex-col space-y-2">
                            {filteredNavItems.map((item) => (
                                <Button
                                    key={item.id}
                                    variant={activeSection === item.id ? "secondary" : "ghost"}
                                    className={`justify-start w-full ${activeSection === item.id ? 'bg-white text-black' : 'text-white'}`}
                                    onClick={() => { setActiveSection(item.id); setIsMenuOpen(false); }}
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Button>
                            ))}
                             {!isAuthenticated ? (
                                <>
                                    <Button variant="ghost" className="justify-start w-full text-white" onClick={() => { setActiveSection('login'); setIsMenuOpen(false); }}><LogIn className="mr-2 h-4 w-4"/>Ingia</Button>
                                    <Button variant="secondary" className="justify-start bg-white text-black" onClick={() => {setActiveSection('signup'); setIsMenuOpen(false)}}><UserPlus className="mr-2 h-4 w-4"/>Jisajili</Button>
                                </>
                             ) : (
                                <Button variant="destructive" className="justify-start" onClick={handleLogout}>Toka</Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}