import { useState } from "react";
import type { FormEvent } from "react";
import { Typography, Box, TextField } from "@mui/material";
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
        <Box sx={{
            backgroundColor: '#ada4a4', 
            height:'100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems:'center',
            padding: 2
            }}>
            <Box sx={{
                backgroundColor: '#3a3939bc',
                height:'50vh',
                padding: '80px',
                borderRadius: '20px',
                               
            }}>
                <Typography variant="h4" 
                sx={{
                    color: '#fa9600'
                }}
                >page de connexion</Typography>
                <Box 
                    component={'form'}
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    >
                    <TextField
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        type="email" 
                        placeholder="Email"
                        required
                        sx={{
                            backgroundColor: 'whitesmoke'
                        }}
                    />
                    <TextField
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        type="password" 
                        placeholder="Mot de passe"
                        className="border p-2 rounded"
                        required
                        sx={{
                            backgroundColor: 'whitesmoke'
                        }}
                    />
                    <button type="submit">
                        se connecter
                    </button>
                    
                </Box>
                <Typography>Vous n'avez pas encore de compte ?</Typography>
                <button onClick={()=>navigate('/register')}>register</button>
            </Box>
        </Box>
    );
}