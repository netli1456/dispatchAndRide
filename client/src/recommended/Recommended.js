import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cards from '../component/Cards';
import Reviews from '../reviews/Reviews';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

function Recommended(props) {
<<<<<<< HEAD
  const { availableProduct, id } = props;
  const [bgReviews, setBgReviews] = useState(false)
=======
  const {  availableProduct } = props;
>>>>>>> 7a959091a8b19eea305debe7f50b6a25f22dbb54

  return (
    <div>
      <div className=" my-3 ">
        {availableProduct && availableProduct.length > 0 && (
          <span className="font1bg fw-bold p-1 d-flex justify-content-center align-items-center w-100 mb-3">
            Recommended similar Items from this store
          </span>
        )}

        <div className="grid-container ">
<<<<<<< HEAD
          {availableProduct &&
            availableProduct?.map((item, index) => (
              <Link
                to={`/product/${item?._id}`}
                key={`${index}`}
                className="box text-decoration-none mb-2 grid-item"
              >
                {' '}
                <Cards item={item} />
              </Link>
            ))}
=======
          {availableProduct && availableProduct
          ?.map((item, index) => (
            <Link
              to={`/product/${item?._id}`}
              key={`${index}`}
              className="box text-decoration-none mb-2 grid-item"
            >
              {' '}
              
                <Cards item={item} />
              
              

            </Link>
          ))}
>>>>>>> 7a959091a8b19eea305debe7f50b6a25f22dbb54
        </div>
      </div>
     
      <Row className={bgReviews ? 'my-5  border-top border-grey font1bg' : '   '}>
        <Col md={1}></Col>
        <Col md={10} className=''>
          {' '}
          {id && (
            <div className="p-3 m-auto ">
              {' '}
              <Reviews bgReviews={bgReviews} setBgReviews={setBgReviews} id={id} />
            </div>
          )}
        </Col>
        <Col md={1}></Col>
      </Row>
    </div>
  );
}

export default Recommended;
