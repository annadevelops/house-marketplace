import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
    //getting loggedIn and checkingStatus from the custom hook useAuthStatus
    const {loggedIn, checkingStatus} = useAuthStatus()

    if (checkingStatus) {
        return <Spinner />
    }
  
    //Outlet is the children Route that is rendered in between the Private Route
    return loggedIn ? <Outlet /> : <Navigate to='/sign-in'/>
}

export default PrivateRoute