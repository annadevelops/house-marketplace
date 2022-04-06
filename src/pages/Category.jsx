import {
    useParams
} from "react-router-dom"
import {
    useEffect,
    useState
} from "react"
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import {
    db
} from '../firebase.config.js'

import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem.jsx";

function Category() {
    const [listings, setListings] = useState()
    const [loading, setLoading] = useState(true)
    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //Creating a reference document to our collection
                const listingsRef = collection(db, 'listings')

                //Initialise the query we want to use
                const q = query(listingsRef, where("type", "==", params.categoryName))
                
                //Get the documents that satisfy the query
                const querySnapshot = await getDocs(q)
        
                //Creating an empty because Firestore returns an array of docs that satisfies the query and we'll have to loop through it to get each doc then push to this array so we can set state
                const listings = []

                //loop through the results array and push each result to the empty array above. Each result has its own id so for the new array listings we need to set the id for each when we push
                querySnapshot.forEach((doc) => {
                    return listings.push(
                      {  id: doc.id,
                        data: doc.data()}
                    )
                })
        
                setListings(listings)
                setLoading(false)
        
            }
         catch (error) {
            toast.error('Something went wrong! Please refresh the page to try again!')
            console.log(error.message)
        }}
        fetchListings()
    }, [])


    return ( 
        <div className='category'>
        <header>
          <p className='pageHeader'>
            {params.categoryName === 'rent'
              ? 'Places for rent'
              : 'Places for sale'}
          </p>
        </header>
  
        {loading ? (<Spinner />) : listings && listings.length > 0 ? (
          <>
            <main>
              <ul className='categoryListings'>
                {listings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                ))}
              </ul>
            </main>
          </>
        ) : (
          <p>No listings for {params.categoryName}</p>
        )}
      </div>
    )
}
export default Category