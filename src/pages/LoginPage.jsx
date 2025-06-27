// File: src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { apiService } from '../apiService';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage({ setActiveSection }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleStandardLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiService.login({ email, password });
            login(response.user, response.token);
            setActiveSection('home');
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const response = await apiService.googleLogin(credentialResponse.credential);
            login(response.user, response.token);
            setActiveSection('home');
        } catch (err) {
            setError(err.message || 'Google login failed.');
        }
    };

    const handleGoogleError = (err) => {
        console.error("Google Login Error:", err);
        setError('Google login failed. See the browser console for details.');
    };

    return (
        <div className="py-12 px-4 max-w-md mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Karibu Tena</CardTitle>
                    <CardDescription>Ingia ili uendelee kupata haki.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <form onSubmit={handleStandardLogin} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Barua pepe</Label>
                            <Input id="email" type="email" placeholder="jina@mfano.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">Nenosiri</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full">Ingia</Button>
                    </form>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t"/></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">AU ENDELEA NA</span></div>
                    </div>
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}