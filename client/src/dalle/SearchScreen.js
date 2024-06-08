import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Link, useLocation } from 'react-router-dom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import './mybite.css';
import Navbar from '../navSection/Navbar';
import Footer from '../footerSection/Footer';
import SearchedItems from './SearchedItems';
import SearchBar from '../component/SearchBar';
import axios from 'axios';
import { api } from '../utils/apiConfig';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import TuneIcon from '@mui/icons-material/Tune';
import TapasIcon from '@mui/icons-material/Tapas';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import NearMeIcon from '@mui/icons-material/NearMe';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import IcecreamIcon from '@mui/icons-material/Icecream';
import SetMealIcon from '@mui/icons-material/SetMeal';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';

function SearchScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'all';
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const location = useLocation();
  const handlePageChange = () => {
    setPage(page + 1);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname !== '/') {
      const handleSearch = async () => {
        try {
          const { data } = await axios.get(
            `${api}/api/users?query=${query}&page=${page}`
          );
          setProducts(data);
        } catch (error) {
          console.log(error);
        }
      };
      handleSearch();
    }
  }, [query, page, location, dispatch]);

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

  return (
    <div>
      <Navbar />
      <SearchBar />

      <div className="search-results d-flex flex-column ">
        {products.length > 0 && (
          <p className="fw-bold my-2">
            {products?.length} kitchens selling{' '}
            <span className="border-bottom border-primary text-danger">
              {query !== 'all' ? query : ''}
            </span>{' '}
            near you found
          </p>
        )}
      </div>
      <Container className='mb-5'>
        {query && products.length === 0 ?
        
         (
          <div className="my-5">
            <div className=" d-flex justify-content-center align-items-center flex-column">
              <p className="fw-bold " style={{ height: '15vh' }}>
                <strong className="border-bottom fs-5  border-primary text-danger">
                  No kitchen found.
                </strong>{' '}
              </p>

              <YoutubeSearchedForIcon
                style={{ width: '100px', height: '100px' }}
                className="text-success "
              />
              <Button variant="light" className=" text-success fs-3 fw-bold">
                Show All Stores
              </Button>
            </div>
          </div>
        ):
          <Row className="my-3">
            <Col md={isSmallScreen ? 12 : 3}>
              <ListGroup variant="flush">
                <ListGroup.Item className={!isSmallScreen ? 'mb-3 ' : 'd-none'}>
                  <strong>Sort</strong>
                </ListGroup.Item>
                <ListGroup.Item
                  className={!isSmallScreen ? 'mb-3 hovering ' : 'd-none'}
                >
                  <span className="d-flex align-items-center gap-3">
                    <NearMeIcon className="text-success" />
                    Near me
                  </span>
                </ListGroup.Item>
                <ListGroup.Item
                  className={!isSmallScreen ? 'mb-3 hovering' : 'd-none'}
                >
                  {' '}
                  <span className="d-flex align-items-center gap-3">
                    <ThumbUpIcon className="text-success" />
                    Rating
                  </span>
                </ListGroup.Item>

                <div className={!isSmallScreen ? 'my-5 ' : 'my-2'}>
                  <strong className={!isSmallScreen ? ' ' : 'd-none'}>
                    Popular filters
                  </strong>

                  <div
                    style={{
                      width: isSmallScreen ? '90%' : '',
                      margin: isSmallScreen ? 'auto' : '',
                    }}
                    className={
                      !isSmallScreen
                        ? 'd-flex flex-column gap-3 mt-3'
                        : 'd-flex fw-bold align-items-center justify-content-between my-2'
                    }
                  >
                    <div
                      className={
                        !isSmallScreen
                          ? 'd-none'
                          : 'd-flex flex-column align-items-center justify-content-center hovering p-2'
                      }
                      style={{
                        borderRadius: isSmallScreen ? '50%' : '',
                        height: isSmallScreen ? '50px ' : '',
                        width: isSmallScreen ? '50px' : '',
                      }}
                    >
                      <span>
                        <TuneIcon className="text-success" />
                      </span>
                      <span>Filter</span>
                    </div>
                    <div
                      className={
                        !isSmallScreen
                          ? 'd-flex align-items-center gap-3 hovering'
                          : 'd-flex flex-column align-items-center justify-content-center hovering p-3'
                      }
                      style={{
                        borderRadius: isSmallScreen ? '50%' : '',
                        height: isSmallScreen ? '55px ' : '',
                        width: isSmallScreen ? '55px' : '',
                      }}
                    >
                      <span className="text-success">
                        <TapasIcon />
                      </span>
                      <span>snacks</span>
                    </div>
                    <div
                      className={
                        !isSmallScreen
                          ? 'd-flex align-items-center gap-2 hovering'
                          : 'd-flex flex-column align-items-center justify-content-center hovering'
                      }
                      style={{
                        borderRadius: isSmallScreen ? '50%' : '',
                        height: isSmallScreen ? '55px ' : '',
                        width: isSmallScreen ? '55px' : '',
                      }}
                    >
                      <span className="text-success">
                        <DinnerDiningIcon />
                      </span>
                      <span>Pasta</span>
                    </div>

                    <div
                      className={
                        !isSmallScreen
                          ? 'd-flex align-items-center gap-2 hovering'
                          : 'd-flex flex-column align-items-center justify-content-center hovering p-2  rounded'
                      }
                    >
                      <span className="text-success">
                        <LocalDiningIcon />
                      </span>
                      <span>local food</span>
                    </div>
                  </div>
                </div>
              </ListGroup>

              <div className={!isSmallScreen ? 'mb-3 ' : 'd-none'}>
                <strong className="">More filters</strong>
                <ListGroup variant="flush" className="mt-3">
                  <ListGroup.Item className="d-flex align-items gap-3 hovering ">
                    <RiceBowlIcon className="text-success" /> Desert
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items gap-3 hovering">
                    <IcecreamIcon className="text-success" />
                    Ice cream
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items gap-3 hovering">
                    <SetMealIcon className="text-success" /> sea foods
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Col>
            <Col md={!isSmallScreen ? 9 : 12}>
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 765: 2, 900: 2 }}
              >
                <Masonry gutter="10px">
                  {products?.length > 0 &&
                    products?.map((item, index) => (
                      <Link
                        to={`/kitchen/${item._id}`}
                        className="text-decoration-none kitchenHover border rounded  p-2 "
                        style={{ minHeight: '200px' }}
                        key={`${index}-${item._id}`}
                      >
                        {' '}
                        <SearchedItems item={item} />
                      </Link>
                    ))}
                </Masonry>
              </ResponsiveMasonry>
            </Col>
          </Row>
         }
      </Container>

      {products.length > 0 && (
        <div className="navigation-button">
          <Button className="button1">see more</Button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default SearchScreen;
