
import { useState, useEffect } from 'react'

export default function AddNewProduct({auth, createProduct}){
    const [title, setTitle ] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [characteristics, setCharacteristics] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [inventory, setInventory] = useState('');
    const [image, setImage] = useState('');
  
    const submitT0CreateProduct = ev => {
      ev.preventDefault();
      createProduct({ title, category, price, characteristics, dimensions, inventory, image});
    }
  
    return(
        <>{
            auth.is_admin && 
                <div className='new-product'>
                    <h3>New Product Form</h3>
                    <form onSubmit={ submitT0CreateProduct }>
                        <input value={ title} placeholder='Title' onChange={ ev=> setTitle(ev.target.value)}/>
                        <input value={ category} placeholder='Category' onChange={ ev=> setCategory(ev.target.value)}/>
                        <input value={ price } placeholder='Price' onChange={ ev=> setPrice(ev.target.value)}/>
                        <input value={ characteristics} placeholder='Characteristics' onChange={ ev=> setCharacteristics(ev.target.value)}/>
                        <input value={ dimensions} placeholder='Dimensions' onChange={ ev=> setDimensions(ev.target.value)}/>
                        <input value={ inventory} placeholder='Inventory' onChange={ ev=> setInventory(ev.target.value)}/>
                        <input value={ image} placeholder='Image Url' onChange={ ev=> setImage(ev.target.value)}/>
                        <button disabled={ !(title && category && price && characteristics && inventory) }>Add Product</button>
                    </form>
                </div>
        }
        </>
    )
}
