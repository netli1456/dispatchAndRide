import React, { useEffect, useState } from 'react';

import NavSearch from '../navSection/NavSearch';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import './product.css';
import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';

import Footer from '../footerSection/Footer';
import ProductDetails from './ProductDetails';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CartCard from '../cartSection/CartCard';

import { useSelector } from 'react-redux';
import { api } from '../utils/apiConfig';

import Recommended from '../recommended/Recommended';

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

  useEffect(() => {
    const relatedProducts = async () => {
      setLoadings(true)
      try {
        const { data } = await axios.post(`${api}/api/products/recommended`, {
          cartItems: cartItems,
          product: product,
        });
       
       setAvailableProduct(data);
        setLoadings(false)
        console.log('items:', data)
      } catch (error) {
        setLoadings(false)
        console.log(error);
      }
    };
    if (product?.type || cartItems?.length !== 0) {
      relatedProducts();
    }
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
      

      {isSmallScreen && cartItems.length > 0 && (
        <Card>
          <Link
            to="/cart"
            className="p-2 d-flex align-items-center  justify-content-between text-decoration-none"
          >
            <strong className="text-dark">Cart(3 Items)</strong>
            <div className="d-flex align-items-center text-success">
              {' '}
              <strong>
                Total:{' '}
                {`N${cartItems
                  .reduce((a, c) => a + c.price * c.quantity, 0)
                  .toFixed(2)}`}{' '}
              </strong>
              <ExpandLessIcon className="fs-1 fw-bold" />
            </div>
          </Link>
        </Card>
      )}
    </div>
}
 </div>
  );
}

export default Product;
