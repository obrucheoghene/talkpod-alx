import { createContext, ReactNode, useEffect, useState } from "react";

import { User } from "../utils/types";


interface AuthContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const storedUser = localStorage.getItem('tk_user');

const initialData = storedUser ? JSON.parse(storedUser) : null;

export const AuthContext = createContext<AuthContextValue>({
    user: initialData,
    setUser: () => { },
});

interface AuthProviderProps {
    children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(initialData);


    useEffect(() => {
        if (user) {
            localStorage.setItem('tk_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('tk_user');
        }
    }, [user])
    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
