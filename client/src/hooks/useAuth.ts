import { useEffect } from "react"
import {  useNavigate } from "react-router-dom"

const useAuth = (failRedirectTo?: string, successRedirectTo?: string) => {
    const navigate = useNavigate();

    const redirect = () => {
        const token = localStorage.getItem("token");
        if (token) {
             navigate(successRedirectTo || "/dashboard");
        }else {
            navigate(failRedirectTo || "/signin");
        }
    }
    const storageEventHandler = (env: StorageEvent) => {
        if (env.key === "token") {
            redirect()
        }
    }
    useEffect(() => {
        redirect();
        addEventListener("storage", storageEventHandler );
        removeEventListener("storage", storageEventHandler)
    }, [])

}

export default useAuth;
