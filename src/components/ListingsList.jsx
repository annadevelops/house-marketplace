import { getAuth } from "firebase/auth"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase.config'
import { useEffect, useState } from "react";
import ListingItem from "./ListingItem";

function ListingsList() {
    const [listings, setListings] = useState([])
    const auth = getAuth()

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, where("userRef", "==", auth.currentUser.uid))
            const querySnapshot = await getDocs(q)

            const listingsCopy = []
            querySnapshot.forEach((listing) => {
                listingsCopy.push({
                    id: listing.id,
                    data: listing.data()
                })
            })
            setListings(listingsCopy)
        }
        fetchListings()
    }, [auth.currentUser.uid])

    //function to delete listing from database which is passed down to listingItem as a prop
    const onDelete = async (listingID) => {
        setListings(prevState => [...prevState.filter(listing => listing.id !== listingID)])
        await deleteDoc(doc(db, "listings", listingID))
    }

  return (
    <>
        <p className="listingText">Your Listings</p>
        <ul className="listingsList">
        {listings.map((listing) => <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={onDelete}/>)} 
        </ul>
    </>
  )
}
export default ListingsList