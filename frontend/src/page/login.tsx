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
        minHeight: '100vh', // minHeight évite que ça coupe si l'écran est minuscule en hauteur
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 2, sm: 4 } // Plus d'espace autour sur grand écran
    }}>
        <Box sx={{
            backgroundColor: '#3a3939bc',
            borderRadius: '20px',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            padding: { xs: '24px', sm: '40px' }, 
            
            width: '100%',
            maxWidth: { xs: '320px', sm: '400px' }, // Ne dépasse jamais cette taille, peu importe l'écran
            
            boxShadow: 3 
        }}>
            <Typography 
                variant="h5" // Donne une vraie taille de titre sémantique
                sx={{
                    color: '#fa9600',
                    fontWeight: 'bold',
                    marginBottom: 3, 
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}
            >
                Page de connexion
            </Typography>

            <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2, // Crée un espace automatique et régulier entre tes inputs/boutons !
                    width: '100%' // Le formulaire prend toute la largeur de la boîte noire
                }}
            >
                <TextField
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    type="email" 
                    placeholder="Email"
                    required
                    fullWidth // Force l'input à s'adapter
                    sx={{
                        backgroundColor: 'whitesmoke',
                        borderRadius: '4px'
                    }}
                />
                
                <TextField
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    type="password" 
                    placeholder="Mot de passe"
                    required
                    fullWidth
                    sx={{
                        backgroundColor: 'whitesmoke',
                        borderRadius: '4px'
                    }}
                />

                {/* Bouton Connexion */}
                <button 
                    type="submit"
                    style={{
                        backgroundColor: '#fa9600',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '10px'
                    }}
                >
                    Se connecter
                </button>

                <Typography sx={{ color: '#fff', fontSize: '14px', textAlign: 'center', marginTop: 2 }}>
                    Vous n'avez pas encore de compte ?
                </Typography>

                {/* Bouton Register */}
                <button 
                    type="button" // Important pour éviter que ce bouton ne valide le formulaire !
                    onClick={() => navigate('/register')}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#fa9600',
                        border: '1px solid #fa9600',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Créer un compte
                </button>
            </Box>
        </Box>
    </Box>
);
}