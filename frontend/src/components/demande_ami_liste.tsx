import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/authcontext";
import Demande_item from "./demande_item";
import type { UserType } from "../context/authcontext";


export interface DemandeAmi {
    id: number;
    user: UserType;         
    destinataire: UserType
    accept: boolean;
}

export default function Demande_Amis() {
    console.log('composant_ami')
    const [liste, setliste] = useState<DemandeAmi[]>([])
    const {user} = useAuth()
    
    const user_id = user?.id 

    const Liste_ami = async(user_id: number) => {
        if (!user_id) return
        try {
            const response = await fetch(`http://localhost:8000/api/chat/liste_demande/${user_id}/`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            setliste(data)
        } catch(error) {
            console.error()
        }
    }

    useEffect(()=> {
        if (user_id) {
            Liste_ami(user_id)
        }
    }, [user_id])

    return(
        <Box sx={{ p: 2 }}>
            <h3 style={{ marginBottom: '1rem' }}>Demandes d'amis reçues</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {liste && liste.length > 0 ? (
                    liste.map((demande) => (
                        <li key={demande.id}>
                            <Demande_item 
                                item={demande} 
                                onrefresh={() => user_id && Liste_ami(user_id)}
                            />
                        </li>
                    ))
                ) : (
                    <p>Aucune demande en attente.</p>
                )}
            </ul>
        </Box>
    )
}