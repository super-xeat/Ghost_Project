import { createContext, useContext, useState } from "react";


interface User {
    name: string,
    Etat: 'en ligne' | 'hors-ligne',
    isAuth: boolean
}

interface AuthContextType {
    user: User | null,
    Login: (email: string, password: string) => Promise<void>,

}

const ContextApp = createContext<AuthContextType | null>(null)

export default function Authcontext({ children }: { children: React.ReactNode }) {

    const [user, setuser] = useState<User | null>(null)

    const Login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:8000/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            
                credentials: 'include', 
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
            
                setuser({
                    name: data.user.username,
                    Etat: 'en ligne',
                    isAuth: true
                })
                console.log('Connexion réussie:', data.user, data.success);
            
            } 
            if (response.status === 401) {
                alert('erreur de mdp ou de mail')
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    }
    return(
        <ContextApp.Provider value={{Login, user}}>
            {children}
        </ContextApp.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(ContextApp);
    if (!context) throw new Error("Oubli du Provider !");
    return context;
};