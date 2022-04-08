import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from '../firebase.config'
import { toast } from "react-toastify"

function Contact() {
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState(null)

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    
    useEffect(() => {
        //fetching the landlord data using the userRef as IDs for users db
        const fetchLandlord = async () => {
            const landlordRef = doc(db, 'users', params.landlordID)
            const landlordSnap = await getDoc(landlordRef)
            if(landlordSnap.exists()) {
                setLandlord((prevState) => ({
                    name: landlordSnap.data().name,
                    email: landlordSnap.data().email
                }))
            } else {
                toast.error('Something went wrong, cannot find contact information for this property. Please contact us for further guidance')
            }
        }
        fetchLandlord()
    }, [])

    const handleChange = (e) => {
        setMessage(e.target.value)
    }
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={handleChange}
              ></textarea>
            </div>

            <a target="_blank"
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}` }
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}
export default Contact