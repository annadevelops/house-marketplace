import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'; // see https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile for docs on creating a user with email and password then update their profile using updateProfile
import {db} from '../firebase.config.js'
import {doc, addDoc, setDoc, serverTimestamp} from 'firebase/firestore' //save to firebase database see https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document



function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  //deconstructing the formData object so we can use email, password without formData.email or formData.password
  const {email, password, name} = formData

  const navigate = useNavigate()

  // handleChange function takes in the event when called then setFormData using the id of the element so below input['email'] has id of email then takes that and set that to the value
  const handleChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Initialize Firebase Authentication and get a reference to the service
      const auth = getAuth()

      //call the createUserWithEmailAndPassword passing in email, password and auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      //Signed in
      const user = userCredential.user

      //Update the current signed in user Profile 
      updateProfile(auth.currentUser, {
        displayName: name
      } )

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()


      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')

    } catch (error) {
      console.log(error)
    }

  }

    return (
      <>
        <div className="pageContainer">
          <header>
            <p className="pageHeader">
              Welcome!
            </p>
          </header>
          <form action="" onSubmit={handleSubmit}>
          <input type="text" className="nameInput" placeholder='Name' id='name' value={name} onChange={handleChange} />
            <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={handleChange} />
            <div className="passwordInputDiv">
              <input 
              type={showPassword ? 'text': 'password'}
              className='passwordInput'
              placeholder='Password'
              value={password}
              onChange={handleChange}
              id='password'/>
              <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState )} />
            </div>
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
              </button>
            </div>
            </form>
            {/* @TODO Google OAuth */}
            <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>
        </div>
      </>
    )
  }
  export default SignUp