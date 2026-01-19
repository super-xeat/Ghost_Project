import { useState } from "react";
import type { FormEvent } from "react";

interface LoginResponse {
    success?: string;
    error?: string;
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8000/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            
                credentials: 'include', 
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const data: LoginResponse = await response.json();
                console.log('Connexion réussie:', data);
            
            } 
            if (response.status === 401) {
                alert('erreur de mdp ou de mail')
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); 
        handleLogin();
        setEmail('');
        setPassword('');
    }
    
    return (
        <div className="flex flex-col items-center p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    type="email" 
                    placeholder="Email"
                    required
                />
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    type="password" 
                    placeholder="Mot de passe"
                    className="border p-2 rounded"
                    required
                />
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
}