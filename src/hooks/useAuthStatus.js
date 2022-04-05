import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    useEffect(() => {
        const auth = getAuth()

        //checking if a user is signed in then set setLoggedIn, after checking then setCheckingStatus
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true)
            }
            setCheckingStatus(false)
        })
    }, [])


  return {loggedIn, checkingStatus}
}