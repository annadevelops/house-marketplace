import {getAuth} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  //Initialise auth then setUser to the current signed in user, if not signed in return null
  const auth = getAuth()

  //logs out user
  const handleLogout = () => {
    auth.signOut()
    navigate('/')
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type='button' onClick={handleLogout}>Logout</button>
      </header>
    </div>
  )
}
export default Profile