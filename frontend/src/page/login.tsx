import { useState } from "react";
import type { FormEvent } from "react";
import { Typography, Box } from "@mui/material";

interface Login {
    email: string,
    password: string
}

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); 
        handleLogin();
        setEmail('');
        setPassword('');
    }
    
    return (
        <div className="flex flex-col items-center p-4">
            <Typography variant="h4">page de connexion</Typography>
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