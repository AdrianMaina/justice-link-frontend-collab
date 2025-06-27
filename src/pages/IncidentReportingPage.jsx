// =================================================================================
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { Checkbox } from '../components/ui/Checkbox';
import { MapPin, EyeOff, AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { apiService } from '../apiService';

export default function IncidentReportingPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const reportData = { title, description, location, is_anonymous: isAnonymous };
            await apiService.createReport(reportData);
            setSuccess('Report submitted successfully! Thank you for your contribution.');
            setTitle('');
            setDescription('');
            setLocation('');
            setIsAnonymous(false);
        } catch (err) {
            setError(err.message || 'Failed to submit report.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl"><AlertTriangle className="h-6 w-6 text-red-600" />Fomu ya Kuripoti Tukio</CardTitle>
                    <CardDescription>Toa maelezo mengi iwezekanavyo. Sehemu zilizo na * ni za lazima.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                            <Label htmlFor="anonymous" className="flex items-center gap-2"><EyeOff className="h-4 w-4" /> Peana ripoti hii bila kujitambulisha</Label>
                        </div>
                        
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input id="title" placeholder="A brief title for the incident" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        
                        <div>
                            <Label htmlFor="location">Eneo</Label>
                            <div className="flex gap-2">
                                <Input id="location" placeholder="Ingiza eneo au anwani" value={location} onChange={(e) => setLocation(e.target.value)} />
                                <Button type="button" variant="outline" onClick={() => setLocation('Nairobi, Kenya (GPS)')}><MapPin className="h-4 w-4 mr-2" /> Pata GPS</Button>
                            </div>
                        </div>
                         <div>
                            <Label htmlFor="description">Maelezo *</Label>
                            <Textarea id="description" placeholder="Eleza kilichotokea..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        
                        <Button type="submit" variant="destructive" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Shield className="h-4 w-4 mr-2" />}
                            {isSubmitting ? 'Inatuma...' : 'Tuma Ripoti kwa Usalama'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}