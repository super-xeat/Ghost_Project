import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: number
    name: string,
    Etat: 'en ligne' | 'hors-ligne',
    isAuth: boolean
}

interface AuthContextType {
    user: User | null,
    Login: (email: string, password: string) => Promise<void>,
    Logout: ()=> Promise<void>
}

const ContextApp = createContext<AuthContextType | null>(null)

export default function Authcontext({ children }: { children: React.ReactNode }) {

    const [user, setuser] = useState<User | null>(null)
    const navigate = useNavigate()

    const Login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:8000/auth/login/', {
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
                    name: data.username,
                    Etat: 'en ligne',
                    isAuth: true
                })
                navigate('/messagerie')
                console.log('Connexion réussie:', data.username, data.success);
            
            } 
            if (response.status === 401) {
                alert('erreur de mdp ou de mail')
            }  
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    }

    const Logout = async() => {
        const response = await fetch('http://localhost:8000/auth/logout/', {
            method: 'POST',
            credentials: 'include'
        })
        if (response.ok) {
            const data = await response.text()
            console.log('vous etes deconnecté', data)
        } else {
            const data = await response.text()
            console.log('vous etes deconnecté', data)
        }
    }

    return(
        <ContextApp.Provider value={{Login, user, Logout}}>
            {children}
        </ContextApp.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(ContextApp);
    if (!context) throw new Error("Oubli du Provider !");
    return context;
};