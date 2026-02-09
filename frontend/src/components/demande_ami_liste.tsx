import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/authcontext";
import Demande_item from "./demande_item";

export interface UserBase {
    id: number;
    username: string;
}

export interface DemandeAmi {
    id: number;
    user: UserBase;         
    destinataire: UserBase;
    accept: boolean;
}

export default function Demande_Amis() {

    const [liste, setliste] = useState<DemandeAmi[]>([])
    const {user} = useAuth()
    
    const user_id = user?.id

    const Liste_ami = async() => {
        if (!user_id) return
        try {
            const response = await fetch(`http://localhost:8000/api/chat/liste_demande/${user_id}`, {
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
        Liste_ami()
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
                                onrefresh={Liste_ami} 
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