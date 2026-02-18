import { useState } from "react";
import type { FormEvent } from "react";
import { Typography, Box } from "@mui/material";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


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
    }
    
    useEffect(()=> {
        if (user && user.Etat === 'en ligne') {
            navigate('/Accueil')
        }
    }, [user])
    
    return (
        <Box sx={{backgroundColor: '#ada4a4', height:'100%', mt: 10}}>
            <Typography variant="h4">page de connexion</Typography>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">
                    se connecter
                </button>
                
                </form>
            <button onClick={Logout}>se deconnecter</button>
        </Box>
    );
}