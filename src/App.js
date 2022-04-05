import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import index from './index.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import NavBar from './components/NavBar';

function App() {
  return ( <
    div className = "App" >
    <Router >
    <Routes >
      <Route path='/' element={<Explore/>}/>
      <Route path='sign-in' element={<SignIn/>}/>
      <Route path='sign-up' element={<SignUp/>}/>
      <Route path='offers' element={<Offers/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='forgot-password' element={<ForgotPassword/>}/>
      <Route path='/*' element={<SignIn/>}/>
    </Routes>
    <NavBar />
    </Router>
    <ToastContainer />
    </div>
  );
}

export default App;
