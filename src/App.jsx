import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import IncidentReportingPage from './pages/IncidentReportingPage';
import MyReportsPage from './pages/MyReportsPage';
import NewsPage from './pages/NewsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
    const [activeSection, setActiveSection] = useState('home');
    const { isAuthenticated } = useAuth();

    const navigateTo = (section) => {
        if ((section === 'report' || section === 'admin' || section === 'my-reports') && !isAuthenticated) {
            setActiveSection('login'); 
        } else {
            setActiveSection(section);
        }
    };
    
    const renderActiveSection = () => {
        switch (activeSection) {
            case 'report':
                return <IncidentReportingPage />;
            case 'my-reports':
                return <MyReportsPage />;
            case 'news':
                return <NewsPage />;
            case 'admin':
                return <AdminPage />;
            case 'login':
                return <LoginPage setActiveSection={setActiveSection} />;
            case 'signup':
                return <SignupPage setActiveSection={setActiveSection} />;
            case 'home':
            default:
                return <HomePage setActiveSection={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen">
            <Navigation activeSection={activeSection} setActiveSection={navigateTo} />
            <main>{renderActiveSection()}</main>
        </div>
    );
}