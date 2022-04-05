import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'



function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  //deconstructing the formData object so we can use email, password without formData.email or formData.password
  const {email, password} = formData

  // handleChange function takes in the event when called then setFormData using the id of the element so below input['email'] has id of email then takes that and set that to the value
  const handleChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value
    }))
  }

    return (
      <>
        <div className="pageContainer">
          <header>
            <p className="pageHeader">
              Welcome Back!
            </p>
          </header>
          <form action="">
            <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={handleChange} />
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text': 'password'}
              className='passwordInput'
              placeholder='password'
              value={password}
              onChange={handleChange} />
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