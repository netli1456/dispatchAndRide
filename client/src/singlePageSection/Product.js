import React, { useEffect, useState } from 'react';

import NavSearch from '../navSection/NavSearch';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
<<<<<<< HEAD
import { Link, useLocation, useParams } from 'react-router-dom';
=======
import { Link, useParams, useLocation } from 'react-router-dom';
>>>>>>> 7a959091a8b19eea305debe7f50b6a25f22dbb54
import axios from 'axios';

import './product.css';
import Button from 'react-bootstrap/Button';

import Footer from '../footerSection/Footer';
import ProductDetails from './ProductDetails';
import CartCard from '../cartSection/CartCard';

import { useSelector } from 'react-redux';
import { api } from '../utils/apiConfig';

import Recommended from '../recommended/Recommended';
import LoadingBox from '../LoadingBox';
import Reviews from '../reviews/Reviews';

function Product() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState({});
  const [loadings, setLoadings] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const [currentImage, setCurrentImage] = useState(null);
  const [availableProduct, setAvailableProduct]=useState([])

  const location = useLocation()

  useEffect(() => {
    const productHandler = async () => {
      setLoadings(true);
      try {
        const { data } = await axios.get(`${api}/api/products/find/${id}`);
        setProduct(data);
        setLoadings(false);
        if (data.imgs) {
          setCurrentImage(data.imgs[0]);
        }
      } catch (error) {
        console.log(error);
        setLoadings(false);
      }
    };
    productHandler();
  }, [id]);

<<<<<<< HEAD
=======
  
>>>>>>> 7a959091a8b19eea305debe7f50b6a25f22dbb54

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

<<<<<<< HEAD
  const [availableProduct, setAvalaibleProduct] = useState([]);
  const location = useLocation();



  useEffect(() => {
    const relatedProducts = async () => {
=======
  useEffect(() => {
    const relatedProducts = async () => {
      setLoadings(true)
>>>>>>> 7a959091a8b19eea305debe7f50b6a25f22dbb54
      try {
        const { data } = await axios.post(`${api}/api/products/recommended`, {
          cartItems: cartItems,
          product: product,
        });
<<<<<<< HEAD

        setAvalaibleProduct(data);
      } catch (error) {
=======
       
       setAvailableProduct(data);
        setLoadings(false)
        console.log('items:', data)
      } catch (error) {
        setLoadings(false)
>>>>>>> 7a959091a8b19eea305debe7f50b6a25f22dbb54
        console.log(error);
      }
    };
    if (product?.type || cartItems?.length !== 0) {
      relatedProducts();
    }
<<<<<<< HEAD
  }, [cartItems, product, location]);



  return (
    <div>
      <div style={{ position: 'sticky', top: -3, zIndex: 999 }}>
        <NavSearch />{' '}
      </div>
=======
  }, [cartItems, product, location,]);

  return (
    <div >
      <NavSearch />
    {loadings ? <div>loading</div> :
      <div >
        <div
          
        >
          <Row className="">
            <Col
              md={isSmallScreen ? 12 : cartItems.length > 0 ? 9 : 12}
              className="product  p-3 "
            >
              {
                <ProductDetails
                  isSmallScreen={isSmallScreen}
                  loadings={loadings}
                  product={product}
                  currentImage={currentImage}
                  setCurrentImage={setCurrentImage}
                />
              }
            </Col>
            {!isSmallScreen && cartItems.length > 0 && (
              <Col md={3} className="my-3">
                <CartCard product={product._id} />

                <Link to="/cart" className="d-grid my-2 text-decoration-none">
                  <Button
                    to="/cart"
                    variant="light"
                    className="text-success border-secondary "
                  >
                    See All
                  </Button>
                </Link>
              </Col>
            )}
          </Row>
        </div>

        <div>
          <Recommended availableProduct={availableProduct} product={product} />
        </div>

        <Footer />
      
>>>>>>> 7a959091a8b19eea305debe7f50b6a25f22dbb54

      {loadings ? (
        <div style={{ height: '80vh', overflow: 'hidden', width:"95vw", margin:"auto" }}>
          <LoadingBox />
        </div>
      ) : (
        <div style={{ overflowX: 'hidden' }}>
          <div>
            <div
              style={{
                width: !isSmallScreen ? '80vw' : '',
                margin: isSmallScreen ? '' : 'auto',
              }}
            >
              <Row>
                <Col
                  md={isSmallScreen ? 12 : cartItems.length > 0 ? 9 : 12}
                  className="product  p-3 "
                >
                  {
                    <ProductDetails
                      isSmallScreen={isSmallScreen}
                      product={product}
                      currentImage={currentImage}
                      setCurrentImage={setCurrentImage}
                      id={product?.userId}
                    />
                  }
                </Col>
                {!isSmallScreen && cartItems.length > 0 && (
                  <Col md={3} className="my-3">
                    <CartCard product={product._id} />

                    <Link
                      to="/cart"
                      className="d-grid my-2 text-decoration-none"
                    >
                      <Button
                        to="/cart"
                        variant="light"
                        className="text-success border-secondary "
                      >
                        See All
                      </Button>
                    </Link>
                  </Col>
                )}
              </Row>
            </div>

            <div className="border boder-danger">
           
              <Recommended
                availableProduct={availableProduct} id={product?.userId}
              />
            
            </div>
          

            <Footer />
          </div>
        </div>
      )}
    </div>
}
 </div>
  );
}

export default Product;
