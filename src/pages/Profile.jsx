import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {updateDoc, doc, collection, query, where, getDocs} from 'firebase/firestore'
import {getAuth, updateProfile} from 'firebase/auth'
import {db} from '../firebase.config.js'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingsList from '../components/ListingsList.jsx'

function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const [changeDetails, setChangeDetails] = useState(false)

  //To check if users has any listings, if so keep count to render the ListingsList later on
  const [listingsCount, setListingsCount] = useState([])

  const {name, email} = formData

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, where("userRef", "==", auth.currentUser.uid))
      const querySnapshot = await getDocs(q)
      const listingsCountCopy = []
      querySnapshot.forEach((doc) => {
        listingsCountCopy.push(doc.id)
      })
      setListingsCount(listingsCountCopy)
    }
    fetchListings()

  }, [])





  //logs out user
  const handleLogout = () => {
    auth.signOut()
    navigate('/')
  }

  //update the display name and name in firestore when 'done' editting
  const handleUpdate = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        //update firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        //update firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast.error('Cannot change detail(s). Please try again!')
    }
  }

  //handle changes to input i.e. name in personal details
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type='button' onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && handleUpdate() 
            setChangeDetails((prevState) => !prevState)}}>
              {changeDetails ? 'done' : 'change'}</p>
        </div>
        <div className="profileCard">
          <form action="">
            <input type="text" id='name' className={!changeDetails ? 'profileName' : 'profileNameActive'} 
            disabled={!changeDetails}
            value={name}
            onChange={handleChange}/>
            <input type="text" id='email' className='profileEmail'
            disabled
            value={email}
            onChange={handleChange}/>
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>
          
          {/**Check if the user has any listings, if so, render the ListingsList component */}
          {listingsCount.length > 0 && ( <ListingsList />)}
      </main>
    </div>
  )
}
export default Profile