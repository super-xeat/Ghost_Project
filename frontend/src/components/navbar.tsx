import { Link } from "react-router-dom";
import React, { useState } from "react";
import Recherche from "./recherche";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useAuth } from "../context/authcontext";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useEffect } from "react";
import Liste_ami from "../page/liste_amis";


export default function Navbar() {

    const {user, Logout} = useAuth() || {}
    const [anchor, setanchor] = useState<null | HTMLElement>(null)

    const handleopen = (event: React.MouseEvent<HTMLElement>) => {
        setanchor(event.currentTarget)
    }

    const handleClose = () => {
        setanchor(null)
    }


    return(
        <Box>            
            <Box sx={{
                position: 'fixed',
                backgroundColor: "#000000",
                display: 'flex',
                flexDirection: {xs: 'row', md:'column'},
                alignItems: 'center',
                width: { xs: '100%', md: '15rem' },
                height: { xs: '10vh', md: '100vh' },
                left: 0,
                top: 0,
                zIndex: 999,
                gap: 1,
                pl: 1
            }}>
                <Box>
                    {user && user.Etat === 'en ligne' ? (
                        <Typography sx={{
                            color: 'orange'
                        }}>
                            {user.username} : {user.Etat}
                        </Typography>
                    ) : (
                        <Typography sx={{
                            color: 'orange',
                            backgroundColor: '#000000',

                        }}>hors ligne
                        </Typography>
                    )}         
                </Box>         
                <br />
          
                <IconButton onClick={handleopen} sx={{
                    order: {xs: 10, md: 0}
                }}>
                    <AccountCircle sx={{
                        color:'white',
                        fontSize: { xs: '40px', md: '50px' }
                    }}/>
                </IconButton>          
                
                <Box sx={{

                }}>
                    <Recherche/>
                </Box>
            
                <Box>
                    <Link to={'/Accueil'} style={{
                        textDecoration: 'none',
                        color: 'orange',
                        fontSize: 20
                    }}>
                    Accueil
                    </Link>          
                </Box>
                
                

                <Box>
                    <Menu
                        open={Boolean(anchor)}
                        onClose={handleClose}
                    >
                    {user && user.Etat === 'en ligne' && (
                        <Box>
                            <MenuItem>
                                <Link to={`/profile/${user?.id}`}>Profil</Link>
                            </MenuItem>
                            <MenuItem onClick={()=>Logout()}>Déconnexion</MenuItem>
                        </Box>
                    )}
                    </Menu> 
                </Box>  
            </Box>

            <Box sx={{
                backgroundColor: '#000000',
                position: 'fixed',
                zIndex: 999,
                height: '10vh',
                bottom: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 5,
                    width: '25%'
                }}>
                    <Link 
                        to={'/demande_amis'}
                        style={{ 
                            color: 'white', 
                            textDecoration: 'none',
                            fontSize: 20,
                            
                        }}
                        >
                        <Typography sx={{
                            color: 'orange'
                        }}>Liste de demande d'ami</Typography>
                    </Link>  
                </Box>

                <Link to={`/Liste_ami/${user?.id}`}>
                    <Button 
                    sx={{
                        color: 'white',
                        border: '2px solid white',
                        padding: 1,
                    }}
                    >+
                    </Button>
                </Link>

                <Box sx={{
                    width:'25%'
                }}>
                    <Link to={`/Liste_amis/${user?.id}`}
                    style={{ 
                            color: 'white', 
                            textDecoration: 'none',
                            fontSize: 20,
                            
                        }}
                    >
                            <Typography sx={{
                                color: 'orange'
                            }}>Liste d'ami</Typography>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}