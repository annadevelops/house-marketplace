import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import {ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";



function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  //deconstructing the formData object so we can use email, password without formData.email or formData.password
  const {email, password} = formData

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
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      //Signed in
      const user = userCredential.user
      if(user) {
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Oops. Wrong email or password!')
    }
  }

    return (
      <>
        <div className="pageContainer">
          <header>
            <p className="pageHeader">
              Welcome Back!
            </p>
          </header>
          <form action="" onSubmit={handleSubmit}>
            <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={handleChange} />
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text': 'password'}
              className='passwordInput'
              placeholder='password'
              value={password}
              onChange={handleChange} 
              id='password'/>
              <img src={visibilityIcon} alt="show password" className="showPassword" onClick={(prevState) => !prevState } />
            </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
              </button>
            </div>
            </form>
            {/* @TODO Google OAuth */}
            <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
        </div>
      </>
    )
  }
  export default SignIn