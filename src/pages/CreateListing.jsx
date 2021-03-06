import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { serverTimestamp, collection, addDoc} from "firebase/firestore"
import Spinner from '../components/Spinner'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../firebase.config.js'
import {v4 as uuidv4} from 'uuid'


function CreateListing() {
const navigate = useNavigate()
const [geolocationEnabled, setgeolocationEnabled] = useState(true)

const [listing, setListing] = useState({
    bathroom: 0,
    bedroom: 0,
    discountedPrice: 2000,
    furnished: true,
    latitude: '',
    longitude: '',
    address: '',
    images: {},
    name: '',
    offer: true,
    parking: true,
    regularPrice: 2500,
    type: 'rent',
    userRef: ''
})

const [loading, setLoading] = useState(false)

const {bathroom, bedroom, discountedPrice, furnished, latitude, longitude, imageUrls, images, address, name, offer, parking, regularPrice, type, userRef} = listing

const auth = getAuth()
useEffect(() => {
  //on load check if a user is signed in or not
    try {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setListing({...listing, userRef: user.uid})
            }
            else {
                navigate('/sign-in')
            }
          });

    } catch (error) {
        toast.error('Something has gone wrong!')
        console.log(error.message)
    }
}, [])

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  if (discountedPrice > regularPrice) {
    setLoading(false)
    toast.error('Discounted price has to be lower than regular price. Please adjust.')
  }

  if(images.length > 6) {
    setLoading(false)
    toast.error('Number of images exceed the maximum amount of 6')
  }

  let geolocation = {}
  let location

  //get geolocation lat and lng using Google Geocoding API
  if(geolocationEnabled) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY}`)
    const data = await response.json()

    geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
    geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
    location = data.status === 'ZERO_RESULTS' ? undefined : address
    if(data.status === 'ZERO_RESULTS') {
      setLoading(false)
      toast.error("Please enter a valid address.")
    }
  } else {
    geolocation.lat = latitude
    geolocation.lng = longitude
    location = address
  }

  //function to store images in firebase - will loop through the images in listing and call this function on each image
  const storeImage = async (image) => {
    //return a new Promise because each function uploads one image and up to 6 images can be uploaded at a time so the function needs to be called multiple times which using a Promise would help 
    return new Promise((resolve, reject) => {
      const storage = getStorage()
      //setting the file name so later on we can create a reference for it on Firebase and then use that ref to interact with the image
      const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}-${name}`

      //creating the reference to the image
      const storageRef = ref(storage, 'images/' + fileName)

      //uploadBytesResumable returns an UploadTask which is assigned here to an uploadTask so the uploadTask can be listened to below for changes and status reporting
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Listen for state changes, errors, and completion of the upload.
          uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            reject(error)
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );

    })
  }

  //storing each image url in imageUrls by mapping through images and call storeImage on each image which returns an array of downloadURL promises then using Promise.all to resolve the array and store resolved promises in the imageUrls array
  const imageUrls = await Promise.all(
    [...images].map((image) => storeImage(image))
    ).catch(() => { //if promise is rejected, it's catched here
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    //creating a copy of the listing to clean up data before uploading it to Firestore
  const listingCopy = {
    ...listing,
    imageUrls,
    geolocation,
    timestamp: serverTimestamp()
  }

  listingCopy.location = location
  delete listingCopy.images
  delete listingCopy.address
  delete listingCopy.latitude
  delete listingCopy.longitude
  !listingCopy.offer && delete listingCopy.discountedPrice

  //calling addDoc to create the new listing then navigate to its own url
  const docRef = await addDoc(collection(db, 'listings'), listingCopy)
  setLoading(false)
  toast.success('Listing created successfully!')
  navigate(`/category/${listingCopy.type}/${docRef.id}`)

}

const handleMutate = (e) => {
  //boolean values from event returns as a string instead of a boolean i.e. 'true' and not true so setting boolean as null then reassign to boolean if that's the value
    let boolean = null

    if(e.target.value === 'true') {
      boolean = true
    } 

    if(e.target.value === 'false') {
      boolean = false
    }

    //Files - check if files then set imagesUrls to be the files. If set to be value then only one file is updated not all
    if(e.target.files){
      setListing((prevState) => ({
        ...prevState,
        images: e.target.files
      }))
    }

    //If not files - i.e. number, boolean then set state of listing accordingly. Check if boolean is null using the nullish coalescing operator (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) ?? - if not null, returns the boolean, if null returns the value
    if(!e.target.files) {
      setListing((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
}

if(loading) {
  return <Spinner/>
}

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create a Listing</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <label className='formLabel'>Sale / Rent</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={handleMutate}
            >
              Sale
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={handleMutate}
            >
              Rent
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={handleMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedroom'
                value={bedroom}
                onChange={handleMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathroom'
                value={bathroom}
                onChange={handleMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={handleMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={handleMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={handleMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={handleMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Location</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={handleMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={handleMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={handleMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={handleMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={handleMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={handleMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={handleMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='imageUrls'
            onChange={handleMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  )
}
export default CreateListing