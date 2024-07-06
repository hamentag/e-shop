import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function Home({illustrationVideos, auth, cart, setMsg, addToCart, products, deleteProduct}){

    const [currentVideoIndex, setCurrentVideoIndex] = useState(Math.floor(Math.random() * illustrationVideos.length));
    const [seller, setSeller] = useState('all');
    const [isVideoReady, setIsVideoReady] = useState(false);
    
    const videoRef = useRef(null);

    const navigate = useNavigate();

    // Function to switch to the next video
    const nextVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % illustrationVideos.length);
    };

    // switch to the previous video
    const previousVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + illustrationVideos.length) % illustrationVideos.length);
    };

    const currentSeller = illustrationVideos[currentVideoIndex].seller


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
        setSeller(illustrationVideos[currentVideoIndex].seller)
        
    }, [currentVideoIndex]);

    // Use useEffect to switch videos every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
        nextVideo();
        }, 10000); // Switch video every 10 seconds

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [currentVideoIndex]);

   

    return (
        <div>
            <div className="illustration-video-background">
                <video ref={videoRef} autoPlay muted loop className="illustration-video-background-content"  
                    onCanPlay={() => setIsVideoReady(true)}>
                    <source src={illustrationVideos[currentVideoIndex].url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {
                    isVideoReady && <>
                        <div className="illustration-video-content">
                            <h1 onClick={()=>{
                                setSeller(currentSeller); 
                                navigate(`products/${currentSeller}`)}}
                                >Shop {illustrationVideos[currentVideoIndex].seller}
                            </h1>
                        
                            <div className='video-shifters'>
                                <div onClick={()=>{ previousVideo()}}><FontAwesomeIcon icon={faChevronLeft} /></div>
                                <div onClick={()=>{ nextVideo()}}><FontAwesomeIcon icon={faChevronRight} /></div>
                            </div> 
                        </div>
                    </>
                }
                
            </div>
        </div> 
    )
}

