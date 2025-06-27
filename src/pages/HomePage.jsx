// File: src/pages/HomePage.jsx
// Description: The main landing page view.
// =================================================================================
import React from 'react';
import Hero from '../components/Hero';
import FeaturesSection from '../components/FeaturesSection';

export default function HomePage({ setActiveSection }) {
    return (
        <>
            <Hero setActiveSection={setActiveSection} />
            <FeaturesSection setActiveSection={setActiveSection} />
        </>
    );
}