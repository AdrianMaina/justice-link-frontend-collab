// =================================================================================
// File: src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { apiService } from '../apiService';

export default function Hero({ setActiveSection }) {
    const [stats, setStats] = useState({ reportsCount: '1,500+', newsCount: 50 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await apiService.getHomeSummary();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch home summary:", error);
                // Keep default stats on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);

     return (
        <section className="relative py-20 overflow-hidden text-primary-foreground">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-destructive to-secondary"></div>
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">JUSTICE LINK KENYA</h1>
                        <p className="text-xl lg:text-2xl mb-4 text-green-200 font-medium">Sauti dhidi ya ukatili wa polisi Kenya</p>
                        <p className="text-lg mb-8 text-slate-200 leading-relaxed">Jukwaa salama, linaloendeshwa na jamii ambapo wahanga na mashahidi wanaweza kuripoti matukio bila kutambulika, kuunganisha na mashirika ya haki za binadamu, na kuchangisha msaada wa haki na mageuzi Kenya.</p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button size="lg" variant="destructive" onClick={() => setActiveSection('report')}>
                                <AlertTriangle className="mr-2 h-5 w-5" /> Ripoti Tukio
                            </Button>
                        </div>
                    </div>
                    <div className="hidden lg:flex justify-center">
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                            <CardContent className="p-6 text-center">
                                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                                <h3 className="text-2xl font-bold mb-2">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : `${stats.reportsCount}+`}</h3>
                                <p className="text-green-200">Matukio Kenya</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}