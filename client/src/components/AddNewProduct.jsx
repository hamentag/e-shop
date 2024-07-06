
import { useState, useRef } from 'react'

export default function AddNewProduct({auth, createProduct}){
    const [title, setTitle ] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [characteristics, setCharacteristics] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [inventory, setInventory] = useState('');

    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [showcaseImageId, setShowcaseImageId] = useState(null);

   
  
    const submitT0CreateProduct = async ev => {
      ev.preventDefault();

      const fls = await Promise.all (images.map(image => {
        return image.file
      }))


      const submittedImages = await Promise.all (images.map(image => {
        const submittedImage = {
            file: image.file,
            caption: image.caption,
            is_showcase: image.id === showcaseImageId    
        }
        return submittedImage
      }))

      await createProduct({ title, category, brand, price, characteristics, dimensions, inventory, submittedImages});
    }


    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
            file: file,
            url: URL.createObjectURL(file),
            caption: '',
            id: Math.random().toString(36).substr(2, 9)
        }));
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const handleCaptionChange = (index, newCaption) => {
        const updatedImages = images.map((image, i) => {
            if (i === index) {
                return { ...image, caption: newCaption };
            }
            return image;
        });
        setImages(updatedImages);
    };

    const handleRemoveImage = (id) => {
        const updatedImages = images.filter(image => image.id !== id);
        setImages(updatedImages);
        if(id === showcaseImageId) setShowcaseImageId(null)
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const handleToggleSwitch = (id) => {
        setShowcaseImageId(id);
    };

    const areFieldsFilled = () => {
        return title && category && brand && price && characteristics && inventory
    }
    

    //
    return(
        <>{
            auth.is_admin && 
                <div className='new-product'>
                    <h3>New Product Form</h3>
                    <form onSubmit={ submitT0CreateProduct }>
                       <div className='product-info'>
                            <input value={ title} placeholder='Title' onChange={ ev=> setTitle(ev.target.value)}/>
                            <input value={ category} placeholder='Category' onChange={ ev=> setCategory(ev.target.value)}/>
                            <input value={ brand} placeholder='Brand' onChange={ ev=> setBrand(ev.target.value)}/>
                            <input value={ price } placeholder='Price' onChange={ ev=> setPrice(ev.target.value)}/>
                            <input value={ characteristics} placeholder='Characteristics' onChange={ ev=> setCharacteristics(ev.target.value)}/>
                            <input value={ dimensions} placeholder='Dimensions' onChange={ ev=> setDimensions(ev.target.value)}/>
                            <input value={ inventory} placeholder='Inventory' onChange={ ev=> setInventory(ev.target.value)}/>
                       </div>
                       <div>
                            <button className="custom-button" onClick={handleButtonClick}>Choose images</button>
                            <input type="file" name="images" multiple onChange={handleImageChange}  ref={fileInputRef} style={{ display: 'none' }} />
                            <div className="image-preview">
                                {images.map((image, index) => (
                                    <div style={{display: 'flex', flexDirection:'column'}} key={image.id} className="image-container">
                                        
                                        {image.id === showcaseImageId? 
                                        <div style={{fontWeight:'bold', color:'navy', backgroundColor:'rgba(175, 175, 175, 0.45)'}}>Showcase image</div>
                                            :
                                        <div style={{display: 'flex', gap:'5px'}}>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={image.id === showcaseImageId}
                                                    onChange={() => handleToggleSwitch(image.id)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                            <div>Set as showcase image</div>                                                
                                        </div>
                                        }
                                            
                                        
                                        <img src={image.url} alt={`selected-${index}`} width="100" />
                                        
                                        <input
                                            type="text"
                                            placeholder="Enter caption"
                                            value={image.caption}
                                            onChange={(e) => handleCaptionChange(index, e.target.value)}
                                        />
                                        <button onClick={() => handleRemoveImage(image.id)}>Remove</button>
                                        
                                    </div>
                                ))}
                            </div>
                       </div>

                       <div>
                        {
                            !(areFieldsFilled() && showcaseImageId)? 'complete all required fields, add image(s), and select showcase image before proceeding': ''
                        }
                       </div>

                       <button className='new-product-submit-btn' disabled={ !(areFieldsFilled() && showcaseImageId)}>Add Product</button>
                    </form>
                </div>
        }
        </>
    )
}
