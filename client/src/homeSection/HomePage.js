import React, { useEffect, useState } from 'react';
import Map from '../component/Map';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import Cards from '../component/Cards';
import { Link } from 'react-router-dom';
import './homePage.css';
import HomeFeatures from './HomeFeatures';
import Footer from '../footerSection/Footer';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EastIcon from '@mui/icons-material/East';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { api } from '../utils/apiConfig';

import { Box, Skeleton } from '@mui/material';
import LetsDoItTogether from './LetsDoItTogether';
import CategoryLayout from './CategoryLayout';

function HomePage(props) {
  const [data, setData] = useState([]);
  const { setOpen } = props;
  const [carouselData, setCarouselData] = useState([]);
  const randomNum = Math.floor(Math.random() * 500);
  const page = 1;
  const { cartItems } = useSelector((state) => state.cart);
  const userId = cartItems.length > 0 ? cartItems[0].userId : '';
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productResponse = await axios.get(
          `${api}/api/products?query=${userId}`
        );

        setData(productResponse.data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get(
          `${api}/api/users/stores?page=${page}`
        );
        setLoading(false);
        setCarouselData(userResponse.data);
      } catch (error) {
        setLoading(false);
        console.log('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? data.length - 1 : currentSlide - 1);
  };

  const nextSlide = () => {
    setCurrentSlide(currentSlide === data.length - 1 ? 0 : currentSlide + 1);
  };

  return (
    <div style={{overflowX:"hidden", backgroundColor:"" }}>
      <Map setOpen={setOpen} />
      
      <div className="my-5 d-flex justify-content-center">
        {' '}
        <h3 className="border-bottom border-secondary">
          We diliver to your door-step
          <HouseOutlinedIcon className="fs-1 text-success" />
        </h3>
      </div>
      {cartItems?.length > 0 && (
        <span className="font1bg fw-bold p-1 d-flex justify-content-center align-items-center">
          Recommended Items from the store in your cart
        </span>
      )}
      <div
        className="d-flex gap-3 justify-content-cente align-items-center my-5 "
        style={{ overflowX: 'hidden', position: 'relative' }}
      >
        {(loading ? Array.from(new Array(5)) : data).map((item, index) => (
          <Link
            to={`/kitchen/${item?.userId}`}
            key={`${index}`}
            className="box text-decoration-none "
            style={{
              height: '270px',
              minWidth: '200px',
              transform:
                currentSlide.length !== currentSlide.length - 1 &&
                `translateX(-${currentSlide * 100}px)`,
            }}
          >
            {' '}
            {item ? (
              <Cards loading={loading} item={item} />
            ) : (
              <div>
                <Skeleton variant="rectangular" width={'100%'} height={118} />
                <Box sx={{ pt: 0.5 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
              </div>
            )}
          </Link>
        ))}
        <div className="icons">
          <div onClick={prevSlide} className="icon border border-white">
            <KeyboardBackspaceIcon className="text-white" />
          </div>
          <div onClick={nextSlide} className="icon border border-white">
            <EastIcon className="text-white" />
          </div>
        </div>
      </div>
      <div className='text-center' style={{}}><h1>Browse our categories</h1>
        <CategoryLayout setOpen={setOpen}/>
      </div>
      <div className="d-flex justify-content-center text-secondary border-top border-grey py-3">
        <div className="d-flex my-5 flex-column">
          <Link
            to="/search"
            className=" text-decoration-none fs-5  fw-bold text-secondary text-capitalize border-bottom border-danger"
          >
            See all available kitchens
          </Link>
          <span>
            {carouselData.length < 50
              ? carouselData.length + randomNum
              : carouselData}{' '}
            stores are currently online
          </span>
        </div>
      </div>
      <div className="rowParent2   ">
        <HomeFeatures loading={loading} carouselData={carouselData} />
      </div>
      <div style={{marginTop:"120px"}}></div>
      <div  className='my-5'>
        <LetsDoItTogether />
      </div>

      <div className=" p-2">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
