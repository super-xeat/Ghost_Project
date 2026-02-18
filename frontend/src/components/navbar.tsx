import { Link } from "react-router-dom";
import React, { useState } from "react";
import Recherche from "./recherche";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useAuth } from "../context/authcontext";
import AccountCircle from '@mui/icons-material/AccountCircle';


export default function Navbar() {

    const {user, Logout} = useAuth()
    const [anchor, setanchor] = useState<null | HTMLElement>(null)

    const handleopen = (event: React.MouseEvent<HTMLElement>) => {
        setanchor(event.currentTarget)
    }

    const handleClose = () => {
        setanchor(null)
    }

    return(
        <Box sx={{
            position: 'fixed',
            backgroundColor: "black",
            display: 'flex',
            flexDirection: {xs: 'row', md:'column'},
            width: { xs: '100%', md: '15rem' },
            height: { xs: '10vh', md: '100vh' },
            left: 0,
            top: 0,
            }}> 
            
            {user ? (
                <Typography sx={{
                    color: 'whitesmoke'
                }}>{user.username} : {user.Etat}</Typography>
            ) : (
                <Typography sx={{
                    color: 'whitesmoke'
                }}>aucun user en ligne
                </Typography>
            )}                  
            <br />
          
            <IconButton onClick={handleopen} sx={{
                order: {xs: 10, md: 0}
            }}>
                <AccountCircle sx={{
                    color:'white',
                    fontSize: { xs: '40px', md: '50px' }
                }}/>
            </IconButton>          
            
            <Box>
                <Recherche/>
            </Box>
            
            <Link 
                to={'/demande_amis'}
                style={{ color: 'white', width: '10vh'}}
                >
                <Typography>Liste de demande</Typography>
            </Link>  

            <Menu
                open={Boolean(anchor)}
                onClose={handleClose}
            >
            {user && user.Etat === 'en ligne' ? (
                <Box>
                    <MenuItem>
                        <Link to={`/profile/${user?.id}`}>Profil</Link>
                    </MenuItem>
                    <MenuItem onClick={()=>Logout()}>Déconnexion</MenuItem>
                </Box>
            ) : (
                <Box>
                    <MenuItem>
                        <Link to={'/register'}>Register</Link>
                    </MenuItem>

                    <MenuItem>
                        <Link to={'/'}>Connexion</Link>
                    </MenuItem>
                </Box>
            )}
            </Menu>          
        </Box>
    )
}