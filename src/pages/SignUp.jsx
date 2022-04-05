import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  //deconstructing the formData object so we can use email, password without formData.email or formData.password
  const {email, password, name} = formData

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
              Welcome!
            </p>
          </header>
          <form action="">
          <input type="text" className="nameInput" placeholder='Name' id='name' value={name} onChange={handleChange} />
            <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={handleChange} />
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text': 'password'}
              className='passwordInput'
              placeholder='password'
              value={password}
              onChange={handleChange} />
              <img src={visibilityIcon} alt="show password" className="showPassword" onClick={(prevState) => !prevState } />
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