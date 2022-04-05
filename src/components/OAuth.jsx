import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const userRef = doc(db, 'users', user.uid)
            const userSnap = await getDoc(userRef)

           if(!userSnap.exists()) {
               await setDoc(doc(db, 'users', user.uid), {
                   name: user.displayName,
                   email: user.email,
                   timestamp: serverTimestamp()
               })
           }
            navigate('/profile')
        } catch (error) {
            toast('Could not login using Google. Please try a different account')
        }
    }

  return (
    <div className='socialLogin'>
    <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
    <button className='socialIconDiv' onClick={handleGoogleClick}>
      <img className='socialIconImg' src={googleIcon} alt='google' />
    </button>
  </div>
  )
}
export default OAuth