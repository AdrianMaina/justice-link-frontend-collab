import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navigation from './components/Navigation'; // Corrected
import HomePage from './pages/HomePage'; // Corrected
import LoginPage from './pages/LoginPage'; // Corrected
import SignupPage from './pages/SignupPage'; // Corrected
import IncidentReportingPage from './pages/IncidentReportingPage'; // Corrected
import MyReportsPage from './pages/MyReportsPage'; // Corrected
import NewsPage from './pages/NewsPage'; // Corrected
import AdminPage from './pages/AdminPage'; // Corrected

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