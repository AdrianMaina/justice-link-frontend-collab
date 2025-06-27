import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { apiService } from '../apiService';

export default function SignupPage({ setActiveSection }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        try {
            await apiService.signup({ username, email, password });
            setSuccess('Account created successfully! Please log in.');
            setTimeout(() => setActiveSection('login'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to create account.');
        }
    };

    return (
        <div className="py-12 px-4 max-w-md mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Fungua Akaunti</CardTitle>
                    <CardDescription>Jiunge na jamii yetu kupigania haki.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="username">Jina la mtumiaji</Label>
                            <Input id="username" type="text" placeholder="chagua jina" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Barua pepe</Label>
                            <Input id="email" type="email" placeholder="jina@mfano.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">Nenosiri</Label>
                            <Input id="password" type="password" placeholder="weka nenosiri" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full">Jisajili</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
