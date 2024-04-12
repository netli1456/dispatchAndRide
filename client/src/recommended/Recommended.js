import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cards from '../component/Cards';
import { Box, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { api } from '../utils/apiConfig';

function Recommended(props) {
  const {  availableProduct } = props;


  
  



  

  return (
    <div>
      <div className=" my-3 ">
        {availableProduct && availableProduct.length > 0 && (
          <span className="font1bg fw-bold p-1 d-flex justify-content-center align-items-center w-100 mb-3">
            Recommended similar Items from this store
          </span>
        )}

        <div className="grid-container ">
          {availableProduct && availableProduct
          ?.map((item, index) => (
            <Link
              to={`/product/${item?._id}`}
              key={`${index}`}
              className="box text-decoration-none mb-2 grid-item"
            >
              {' '}
              
                <Cards loading={loadings} item={item} />
              
              

            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommended;
