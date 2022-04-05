import {getAuth} from 'firebase/auth'
import { useEffect, useState } from 'react'

function Profile() {
  const [user, setUser] = useState(null)

  //Initialise auth then setUser to the current signed in user, if not signed in return null
  const auth = getAuth()
  useEffect(() => {
    setUser(auth.currentUser)
  }, [])
  return user ? <h1>{user.displayName}</h1> : <p>Not Logged In</p>
}
export default Profile