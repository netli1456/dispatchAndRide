import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cards from '../component/Cards';
import { Box, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { api } from '../utils/apiConfig';

function Recommended(props) {
  const { product, } = props;
  const [loadings, setLoading] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const [availableProduct, setAvalaibleProduct] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const relatedProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.post(`${api}/api/products/recommended`, {
          cartItems: cartItems,
          product: product,
        });
       
        setAvalaibleProduct(data);
        setLoading(false)
        console.log('items:', data)
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    if (product?.type || cartItems?.length !== 0) {
      relatedProducts();
    }
  }, [cartItems, product, location,]);

  return (
    <div>
      <div className=" my-3 ">
        {availableProduct && availableProduct.length > 0 && (
          <span className="font1bg fw-bold p-1 d-flex justify-content-center align-items-center w-100 mb-3">
            Recommended similar Items from this store
          </span>
        )}

        <div className="grid-container ">
          {(loadings
            ? Array.from(new Array(5))
            : availableProduct && availableProduct
          )?.map((item, index) => (
            <Link
              to={`/product/${item?._id}`}
              key={`${index}`}
              className="box text-decoration-none mb-2 grid-item"
            >
              {' '}
              {item ? (
                <Cards loading={loadings} item={item} />
              ) : (
                <div>
                  <Skeleton variant="rectangular" width={210} height={118} />
                  <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommended;
