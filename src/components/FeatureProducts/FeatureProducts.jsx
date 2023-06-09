import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import style from './FeatureProducts.module.css';
import { Link } from 'react-router-dom';
import { cartContext } from '../../Context/CartContext';
import { toast } from 'react-hot-toast';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

export default function FeatureProducts() {
  let {addToCart, setnumbOfCartItems} = useContext(cartContext);

  async function addProdut(productId){
    let response = await addToCart(productId);

    if(response?.data?.status === "success"){
      setnumbOfCartItems(response?.data?.numOfCartItems);
      toast.success(response.data.message, {duration:2000, position:"bottom-right", className:"border-success border"})
    }
    else{
      toast.error("Error", {duration:2000});
    }
  }

  const [products, setProducts] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  async function getProducts() {
    setisLoading(true)
    let { data } = await axios.get(`https://route-ecommerce.onrender.com/api/v1/products`);
    setProducts(data.data);
    setisLoading(false);
  }

  useEffect(() => {
    getProducts();
  }, [])

  return  <>
    <section className='py-5'>

      <div className="container">
        <div className="row">
          {isLoading?<LoadingScreen />:
          <>
          {products.map(product => (
          <div  key={product._id} className="col-md-3">
            <div className='product-item'>
              <i className="fa-regular fa-heart"></i>
              <Link to={`ProductDetails/${product._id}`}> 
                <img className='w-100'  src={product.imageCover} alt={product.title} />
                <span className='main-text fw-bold'>{product.category.name}</span>
                <h3 className='h-6 fw-bold py-3'>{product.title.split(" ").slice(0,2).join(" ")}</h3>
                <div className='d-flex justify-content-between'>
                  <span className='text-muted'>{product.price}EGP</span>
                  <span>
                    <i className='fas fa-star rating-color'>
                      {product.ratingsAverage}
                    </i>
                  </span>
                </div>
              </Link>
              <button onClick={()=>addProdut(product._id)} className='btn btn-add main-bg text-white w-100'>+ Add</button>
            </div>
          </div>
        ))}
          </>
          
          }

        </div>
      </div>
    </section>
  </>
}
