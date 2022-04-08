import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../firebase.config';
import Spinner from "./Spinner";
// import Swiper core and required modules
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

function Slider() {
    const [sliders, setSliders] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        const fetchListings = async () => {
            const queryListings = await getDocs(collection(db, "listings"))
            const slidersCopy = []
            queryListings.forEach((doc) => {
                slidersCopy.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setSliders(slidersCopy)
        }
        fetchListings()
        setLoading(false)
    }, [])


    console.log(sliders[0])

if (loading) {
    return <Spinner/>
}

  return (
    <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
        // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            //swiper 8.0.* has to explicitly set a height for the Swiper container
            style={{height: '400px'}}
        >
        {sliders.map((slider, index) => (
            <SwiperSlide key={index} onClick={() => navigate(`/category/${slider.data.type}/${slider.id}`)}>
            <div       
                style={{
                    background: `url(${slider.data.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover'
                }}
                className="swiperSlideDiv"></div>
                <p className="swiperSlideText">{slider.data.name}</p>
                <p className="swiperSlidePrice">
                    ${slider.data.discountedPrice ?? slider.data.regularPrice}{' '}
                    {slider.data.type == 'rent' && '/ month'}
                </p>
            </SwiperSlide>
        ))}
        </Swiper>
    </>
  )
}
export default Slider