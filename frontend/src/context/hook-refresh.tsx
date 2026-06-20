import { useState } from "react";
import getcookie from "./csrf";


interface TokenHookResponse {
    refresh: () => Promise<boolean>;
    loading: boolean;
}

export default function useToken(): TokenHookResponse {
    const [loading, setLoading] = useState(false);
    const csrf = getcookie('csrftoken')

    
    async function refresh(): Promise<boolean> {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/auth/refresh/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf || '',
                },
                credentials: 'include' 
            });
            console.log('refresh réussi !')
            return response.ok
        } catch (error) {
            console.error("Erreur de rafraîchissement", error)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { refresh, loading };
}