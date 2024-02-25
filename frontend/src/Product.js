import { useState, useEffect } from "react";
import axios from "axios";
import Popup from 'reactjs-popup';

export default function Product() {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        console.log("request to api");
        axios.get("http://127.0.0.1:5000/products")
            .then(response => setProduct(response.data))
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const deleteProduct = async (id) => {
        try {
            const deletes = await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            if (deletes) {
                window.location.reload(false);
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const add_product = async () => {
        const formData = new FormData();
        formData.append('name', document.querySelector('.name').value);
        formData.append('price', document.querySelector('.price').value);
        formData.append('image', document.querySelector('.img').value);

        try {
            const response = await axios.post('http://127.0.0.1:5000/add_product', formData);

            if (response.status === 201) {
                console.log('Product added successfully');
                window.location.reload(false);
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };


    const update_product = async (id) => {
        let nameA = document.querySelector('.nameA').value
        let price =  document.querySelector('.priceA').value
        let img = document.querySelector('.imgA').value
    
        try {
            const response = await axios.put(`http://127.0.0.1:5000/products/${id}`, 
            {
                name : nameA,
                price : price,
                img : img
            });
    
            if (response.status === 200) {
                console.log('Product updated successfully');
                window.location.reload(false);
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const productList = product.map(p => (
        <li key={p._id}>
            <img src={p.img} alt={`Product ${p._id}`} style={{width:180 , height:180}}/>
            <br />
            {p._id + 1}). Model : {p.name} <br></br> Price : {p.price} Bath. <br></br>
            <button onClick={() => deleteProduct(p._id)} style={{ background: 'red', color: 'white' }}>Delete</button>
            <Popup trigger=
                {<button style={{ background: 'green', color: 'white' }}>Update</button>} 
                modal nested>
                {
                    close => (
                        <div className='modal' style={{display:'flex',justifyContent:'center',alignItems:'center',background:'gray',width:300,height:200}}>
                            <div className='content' >
                                <div>
                                    <label style={{color:'white'}}>Name </label><input type="text" className="nameA"></input>
                                    <br></br>
                                    <label style={{color:'white'}}>Price </label><input type="number" className="priceA"></input>
                                    <br></br>
                                    <label style={{color:'white'}}>Image </label><input type="text" className="imgA"></input>
                                    <br></br>
                                    <button onClick={()=>update_product(p._id)}>Add</button>
                                    <button onClick={()=>{close()}}>close</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </li>
    ));

    return (
        <>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '10px', listStyle: 'none' }}>
                {productList}
            </ul>
            <Popup trigger=
                {<button> Click to open modal </button>} 
                modal nested>
                {
                    close => (
                        <div className='modal' style={{display:'flex',justifyContent:'center',alignItems:'center',background:'gray',width:300,height:200}}>
                            <div className='content' >
                                <div>
                                    <label style={{color:'white'}}>Name </label><input type="text" className="name"></input>
                                    <br></br>
                                    <label style={{color:'white'}}>Price </label><input type="number" className="price"></input>
                                    <br></br>
                                    <label style={{color:'white'}}>Image </label><input type="text" className="img"></input>
                                    <br></br>
                                    <button onClick={add_product}>Add</button>
                                    <button onClick={()=>{close()}}>close</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </>
    );
}
