import { Message } from "@mui/icons-material";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { Dispatch } from "react";
import type { SetStateAction } from "react";
import getcookie from "./csrf";
import { useNavigate } from "react-router-dom";


export interface UserType {
    id?: number 
    username?: string,
    Etat: 'en ligne' | 'hors-ligne',
    isAuth: boolean
}

export interface Message {
    action: string;
    destinataire_id: number; 
    user?: number | null; 
    sender_name?: string;   
    texte?: string;
}

export interface AuthContextType {
    user: UserType | null,
    Login: (email: string, password: string) => Promise<void>,
    Logout: ()=> Promise<void>
    sendmessage: (message: Message)=> void
    message: Message[]
    setmessage: Dispatch<SetStateAction<Message[]>>
}

const ContextApp = createContext<AuthContextType | null>(null)

export default function Authcontext({ children }: { children: React.ReactNode }) {

    const [user, setuser] = useState<UserType | null>(null)
    const [message, setmessage] = useState<Message[]>([])
    const navigate = useNavigate()

    useEffect(()=> {
        async function Csrf_token() {
            try {
                const response = await fetch('http://localhost:8000/api/auth/csrf', {
                    method:'GET',
                    credentials: 'include'
                })
                
                if (response.ok) {
                    console.log('csrf créer')
                }

            } catch (error) {
                console.log('error de lappel')
            }
        }
        Csrf_token()
    }, [])


    useEffect(()=> {
        async function Verif_token() {
            try {
                const response = await fetch('http://localhost:8000/api/auth/verif_token/', {
                    method: 'GET',
                    credentials: 'include'
                })

                if (response.status === 200) {    
                    const data = await response.json()
                    console.log('vous etes reconnecté')
                    setuser({
                        id: data.id,
                        username: data.username,
                        Etat: 'en ligne',
                        isAuth: true
                    })
                    console.log('user reconnecté :', user)
                }
            } catch(error) {
                console.error('erreur :', error)
            }
        }
        Verif_token()
    }, [])

    
    const Login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
            
                setuser({
                    id: data.id,
                    username: data.username,
                    Etat: 'en ligne',
                    isAuth: true
                })              
                console.log('Connexion réussie:', data.id, data.username, data.success);          
            } 
            if (response.status === 401) {
                alert('erreur de mdp ou de mail')
            }  
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    }

    const Logout = async() => {
        const csrf = getcookie('csrftoken') as string | undefined
        console.log('csrf :', csrf)
        if (!csrf) {
            return
        }
        const response = await fetch('http://localhost:8000/api/auth/logout/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf || '',
            }
        })
        if (response.ok) {
            const data = await response.text()
            setuser({
                isAuth: false, 
                Etat: 'hors-ligne'
            })
            navigate('')
            console.log('vous etes deconnecté', data)

        } else {
            const data = await response.text()
            console.log('vous etes deconnecté', data)
        }
    }

    const socketRef = useRef<WebSocket | null>(null)
    useEffect(()=> {
        if (!user) return

        const ws = new WebSocket('ws://localhost:8000/ws/chat/');
        socketRef.current = ws
        ws.onopen = ()=> {console.log('socket ouvert')}
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            // 6. Réception des message chez l'autre personne
            // a partir de là ... chemin inverse pour que je recoive MOI les message
            
            if (data.action === 'demande_ami') {
                alert('vous avez une demande ami')
            } 
            if (data.action === 'message') {
                setmessage(prev =>[...prev, data])
            }
        }
        return ()=> {
            ws.close()
            console.log('serveur éteint')
        }
    }, [user])

    const sendmessage = (message: Message) => {
        const ws = socketRef.current
        if (ws && ws.readyState === WebSocket.OPEN) {    
            ws.send(JSON.stringify(message))
            setmessage(prev => [...prev, message])
            // 1. Envoi du message dans MON django
        }
    }

    return(
        <ContextApp.Provider value={{Login, user, Logout, sendmessage, message, setmessage}}>
            {children}
        </ContextApp.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(ContextApp);
    if (!context) throw new Error("Oubli du Provider !");
    return context;
};