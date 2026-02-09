import { useState } from "react";
import type { FormEvent } from "react";
import { Typography, Box } from "@mui/material";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

interface Login {
    email: string,
    password: string
}

export default function Login() {

    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {Login, Logout, user} = useAuth()

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); 
        Login(email, password)
        setEmail('');
        setPassword('');  
        if (user?.Etat === 'en ligne') {
        navigate('/Accueil')}
    }
    
    return (
        <Box sx={{backgroundColor: '#ada4a4', height:'100%'}}>
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
                    se connecter
                </button>
                
                </form>
            <button onClick={Logout}>se deconnecter</button>
        </Box>
    );
}