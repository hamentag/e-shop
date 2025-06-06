import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function Home({homeImages, auth, cart, setMsg, addToCart, products, deleteProduct}){

    const [currentImgIndex, setCurrentImgIndex] = useState(Math.floor(Math.random() * homeImages.length));

    const navigate = useNavigate();

    // Function to switch to the next image
    const nextImage = () => {
        setCurrentImgIndex((prevIndex) => (prevIndex + 1) % homeImages.length);
    };

    // switch to the previous image
    const previousImage = () => {
        setCurrentImgIndex((prevIndex) => (prevIndex - 1 + homeImages.length) % homeImages.length);
    };

    // Use useEffect to switch images every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 10000); // Switch image every 10 seconds

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [currentImgIndex]);

   
    return (
        <div>
            <div className="home-image"
                style={{ backgroundImage: `url(${homeImages[currentImgIndex].url})` }} >

                <h1 onClick={()=>{
                    navigate(`products/${homeImages[currentImgIndex].brand}`)}}
                    >Shop {homeImages[currentImgIndex].brand}
                </h1>
                <div className='image-shifters'>
                    <div onClick={() => { previousImage() }}><FontAwesomeIcon icon={faChevronLeft} /></div>
                    <div onClick={() => { nextImage() }}><FontAwesomeIcon icon={faChevronRight} /></div>
                </div>
            </div>
        </div> 
    )
}
