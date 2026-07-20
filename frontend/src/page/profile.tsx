import { useState, useEffect } from "react";
import { Box, Typography, Button, ListItem, List, TextField } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { UserType } from "../context/authcontext";
import Recup_conv from "../components/Profil_ami_item";
import useToken from "../context/hook-refresh";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import getcookie from "../context/csrf";



export default function Profile() {

    const {user} = useAuth()
    const [liste, setliste] = useState<UserType[]>([])

    const [modifname, setmodifname] = useState<Boolean>(false)
    
    const [modifimage, setmodifimage] = useState<Boolean>(false)
    
    const {refresh} = useToken()

    const [username, setusername] = useState<string>("")
    const [file, setfile] = useState<File | null>(null)

    const userId: number | null = user?.id ?? null


    async function Profile_fetch(userId : number)  {
        if (!user) {
            console.log('user inconnu dans le composant profile')
            return 
        } 
        try {
            let response = await fetch(`http://localhost:8000/api/auth/profile/${userId}/`, {
                method: 'GET',
                credentials: 'include'
            })

            if (response.status === 401) {
                const token = await refresh()
                if (token) {
                    response = await fetch(`http://localhost:8000/api/auth/profile/${userId}/`, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    const data = await response.json()
                    console.log('data profile:', data) 

                    setliste(data.liste_amis)
                    console.log('liste :', data.liste_amis)
                } else {
                    console.log('error')
                }
            } else {
                const data = await response.json()
                console.log('data :', data)
                setliste(data.liste_amis)
            }
        } catch(error) {
            console.error('erreur dans le composant profile', error)
        }
    }

    function Modifname() {
        setmodifname(!modifname)
    }

    function Modifimage() {
        setmodifimage(!modifimage)
    }

    

    async function ModifConfirm(userId: number | undefined, event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const csrf = getcookie('csrftoken') as string | undefined

        const formdata = new FormData()

        if (file) {
            formdata.append('avatar', file)
        }
        if (username) {
            formdata.append('username', username)
        }

        try {
            let response = await fetch(`http://localhost:8000/api/auth/modif_profil/${userId}/`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrf || '',
                },
                // mettre le jeton csrf

                body: formdata
            })

            const result = await response.json()

            if (response.status === 401) {
                const token = await refresh()
                
                if (token) {
                    console.log('refresh ok')

                    response = await fetch(`http://localhost:8000/api/auth/modif_profil/${userId}/`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': csrf || '',
                    },
                    body: formdata
                })
                const result = await response.json()
                if (response.ok) {
                    alert('profil modifié !')
                    console.log('modification réussi', result)
                    setusername('')
                    setfile(null)

                    if (userId) {Profile_fetch(userId)}

                } else {
                    console.log('problème lors du refresh')
                }
            }}
            if (response.ok) {
                alert('profil modifié !')
                console.log('modification réussi', result)
                setusername('')
                setfile(null)

                if (userId) {Profile_fetch(userId)}
                
            } else {
                console.log('erreur', result)
            }

        } catch(error) {
            console.error('erreur de fetch')
        }
    }
    
    useEffect(()=> {
        if (user && user.id) {
            Profile_fetch(user.id)
        }        
    }, [user?.id])

    // attention le bouton supprimer supprime l'ami et non 
    // et non la discussion ... A déplacer dans le fichier
    // liste_ami.jsx

    return(
        <Box sx={{          
            background: 'linear-gradient(120deg, #000000 0%, #2e2e2e 40%, #010101 60%, #161616 100%)',
            backgroundSize: '200% 200%',
            animation: 'metalSweep 8s ease infinite',
            '@keyframes metalSweep': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
            },
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',   
            minHeight: '100vh',
            pt: 0.1,
            }}>
            <Box sx={{
                mt: { xs: 15, sm: 20, md: 25 },
                ml: { xs: 2, sm: 8, md: 35 },               
            }}>
                <Box sx={{
                    height: '35vh',
                    backgroundColor: '#4e4c4c20',
                    margin: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 4,
                    width: '100%'
                }}>
                    
                    {user?.id && modifname ?
                        (<Box component="form" onSubmit={(event) => ModifConfirm(user.id, event)}>
                            <TextField onChange={(e)=>setusername(e.target.value)} value={username} type="text" sx={{
                                backgroundColor: '#858585ef',
                                borderRadius: '15px'
                            }}/>
                            <Button type="submit">envoyer</Button>
                            <Button onClick={()=>Modifname()}>annuler</Button>
                        </Box>
                    ) : (
                        <Box>
                            <Typography sx={{
                                color: 'orange',
                                fontSize: '30px'
                            }}>Bienvenue : {user?.username}</Typography>

                            <Button onClick={()=>Modifname()}>modifier votre pseudo</Button>
                        </Box>
                        )                      

                        
                    }
                    
                    {user?.id && modifimage ?
                        (
                            <Box component="form" onSubmit={(event) => ModifConfirm(user.id, event)}>
                                
                                <TextField sx={{
                                    backgroundColor: 'whitesmoke'
                                }}
                                    onChange={(e)=> {
                                    const input = e.target as HTMLInputElement;
                                    if (input.files && input.files[0]) {
                                        setfile(input.files[0]);
                                    }}} 
                                    
                                    type="file"/>

                                <Button type="submit">envoyer</Button>
                                <Button onClick={()=>Modifimage()}>annuler</Button>
                            </Box>
                        ) : (
                            <Box>
                                <Stack direction="row" spacing={2}>
                                    <Avatar alt="Remy Sharp" src={user?.avatar} sx={{
                                        width: '100px',
                                        height: '100px'
                                    }}/>                       
                                </Stack>
                                <Button onClick={()=>Modifimage()}>modifier votre avatar</Button>
                            </Box>
                        )                       
                    }

                </Box>
                <Typography color="orange">Liste-amis :</Typography>
                <List sx={{
                    listStyle: 'none',
                    color: 'orange'
                }}>
                    {liste && liste.map((char, index)=> (
                        
                        <ListItem key={index} sx={{
                            color: 'orange'
                        }}>                          
                               
                            <Recup_conv 
                            name={char?.username}
                            id1={user?.id}
                            ami={char}
                            mode={'profil'}
                            />
                        </ListItem>  
                    ))}
                </List>

                
            </Box>
        </Box>
    )
}