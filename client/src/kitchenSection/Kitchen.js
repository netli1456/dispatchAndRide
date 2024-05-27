import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import './kitchen.css';
import Cards from '../component/Cards';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Navbar from '../navSection/Navbar';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import WidgetsIcon from '@mui/icons-material/Widgets';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';

import SearchKitchen from './SearchKitchen';
import { toast } from 'react-toastify';
import { api } from '../utils/apiConfig';
import { Box, Skeleton } from '@mui/material';

function Kitchen() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const params = useParams();
  const { id } = params;
  const [openSort, setOpenSort] = useState(false);
  const [kitchenData, setKitchenData] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const category = sp.get('category') || 'all';
  const page = sp.get('page') || 1;

  const [cat, setCat] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchedCategory = async () => {
      try {
        const { data } = await axios.get(
          `${api}/api/products/kitchen/cat/${id}?category=${category}`
        );

        setCat(data);
      } catch (error) {
        console.log(error);
      }
    };
    searchedCategory();
  }, [id, category]);

  // const filteredProducts = (filter) => {
  //   const filteredCategory = filter.category || category;
  //   const filteredPrice = filter.price || price;
  //   const filteredPage = filter.page || page;

  //   return `/search?page=${filteredPage}&price=${filteredPrice}&category=${filteredCategory}`;
  // };

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${api}/api/products/kitchen/${id}?query=${query}&page=${page}&price=${price}&category=${category}`
        );

        setKitchenData(data);
        setLoading(false);
      } catch (error) {
        toast.error(
          'error fetching data',
          { toastId: 'unique-toast-id' },
          error
        );
        setLoading(false);
      }
    };
    handleSearch();
  }, [query, category, price, page, id]);

  useEffect(() => {
    const screenSieze = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };
    screenSieze();

    window.addEventListener('resize', screenSieze);

    return () => {
      window.removeEventListener('resize', screenSieze);
    };
  }, [openSort]);

  return (
    <div >
      <Navbar />

      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '100%',
            height: isSmallScreen ? '200px' : '300px',
            position: 'relative',
            top: '0',
          }}
        >
          <img
            src={
              !loading ? (
                kitchenData?.businessImg
              ) : (
                <Skeleton className="d-none d-md-block" variant="danger" />
              )
            }
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="blur-on-hover"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: isSmallScreen ? 20 : 50,
            width: '100%',
          }}
        >
          <SearchKitchen searchedQuery={query} id={id} />
          <div className="  ">
            <div
              style={{ width: '90vw', margin: 'auto', zIndex: 9999 }}
              className="d-md-flex gr d-none align-items-center gap-2"
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid grey',
                }}
              >
                <img
                  src={
                    !loading ? (
                      kitchenData?.businessImg
                    ) : (
                      <Skeleton
                        className="d-none d-md-block"
                        variant="danger"
                      />
                    )
                  }
                  alt=""
                  style={{ width: '100%', borderRadius: '50%' }}
                />
              </div>

              {loading ? (
                <Skeleton className="d-none d-md-block" width={50} />
              ) : (
                <Link className=" text-white fs-5 fw-bold text-capitalize">
                  {' '}
                  {kitchenData?.businessName} stores
                </Link>
              )}
            </div>

            <div className="search-resu d-flex align-items-center justify-content-center text-white mb-2 ">
              {loading ? (
                <div>
                  <Skeleton className="d-none d-md-block" width={100} />
                </div>
              ) : (
                <p className="fw-bold">
                  {kitchenData?.products?.length}{' '}
                  {query && query !== 'all' ? query : ''} found on{' '}
                  <span className="border-bottom border-primary text-dange">
                    {kitchenData.businessName} stores
                  </span>{' '}
                </p>
              )}
            </div>
          </div>

          <div style={{ overflowX: 'hidden',  }}>
            <div className={isSmallScreen ? '' : 'small'}>
              <Row>
                <Col
                  md={3}
                  style={{
                    position: 'sticky',
                    top: -10,
                    height: 'calc(100vh -220px',
                    backgroundColor: 'lightgrey',
                 
                  }}
                >
                  <div
                    style={{
                      position: 'sticky',
                      top: 0,
                      height: 'calc(100vh -220px',
                 
                    }}
                  >
                    <div>
                      <ListGroup variant="flush">
                        <ListGroup.Item
                          className={isSmallScreen ? 'pt-3' : ''}
                          style={{
                            backgroundColor: isSmallScreen ? 'lightgrey' : '',
                          }}
                        >
                          {loading ? (
                            <div>
                              <Skeleton />
                              <Skeleton />
                              <Skeleton width="60%" />
                              <Skeleton />
                            </div>
                          ) : (
                            <div className="search-results1 rounded " >
                              <div className="d-flex align-items-center gap-1 ">
                                <strong className="text-capitalize d-flex align-items-center gap-1 border-bottom text-dark">
                                  <span
                                    onClick={() => setOpenSort(!openSort)}
                                    style={{ width: 'fit-content' }}
                                    className={
                                      isSmallScreen && openSort
                                        ? 'd-flex bg-success border p-1 rounded align-items-center'
                                        : 'd-flex bg-white border p-1 rounded align-items-center'
                                    }
                                  >
                                    <WidgetsIcon
                                      className={
                                        isSmallScreen && openSort
                                          ? 'text-white'
                                          : ''
                                      }
                                    />
                                    <KeyboardArrowDownIcon
                                      className={
                                        isSmallScreen && openSort
                                          ? 'text-white'
                                          : ''
                                      }
                                    />
                                  </span>{' '}
                                  {kitchenData?.businessName}
                                </strong>
                                {kitchenData?.verified && (
                                  <img
                                    src="https://cdn-icons-png.freepik.com/512/7641/7641727.png"
                                    alt=""
                                    style={{ width: '20px' }}
                                  />
                                )}
                              </div>
                              <span
                                style={{ fontSize: '11px' }}
                                className="p-2"
                              >
                                All products here belongs to{' '}
                                {kitchenData?.businessName} stores
                              </span>
                            </div>
                          )}
                        </ListGroup.Item>
                        {loading ? (
                          <div>
                            <Skeleton height={200} />
                            <Skeleton />
                            <Skeleton width="60%" />
                            <Skeleton />
                          </div>
                        ) : (
                          <div
                            className={
                              isSmallScreen && !openSort
                                ? 'd-none d-md-flex flex-column'
                                : 'd-flex flex-column'
                            }
                          >
                            <ListGroup.Item c>
                              <strong>Price Range: </strong>
                              <div className="d-flex fw-bold gap-1 align-items-center">
                                <span>0</span>
                                <Form.Range
                                  min={0}
                                  max={1000}
                                  onChange={(e) => setMaxPrice(e.target.value)}
                                  className="custom-rang "
                                />
                                <span>{maxPrice}</span>
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <div>
                                <div className=" ">
                                  <strong>Sort by:</strong>
                                  <Form className="d-flex flex-column border custom-background">
                                    <InputGroup
                                      variant="light"
                                      style={{
                                        width: 'fit-content',
                                        border: 'none',
                                      }}
                                    >
                                      <InputGroup.Text className="d-flex   gap-1 border-0">
                                        All{' '}
                                        <Form.Check
                                          name=""
                                          id=""
                                          type="checkbox"
                                        />
                                      </InputGroup.Text>
                                    </InputGroup>
                                    {cat?.map((c, index) => (
                                      <InputGroup
                                        key={index}
                                        style={{ width: 'fit-content' }}
                                      >
                                        <InputGroup.Text className="border-0 d-flex gap-1">
                                          <Link
                                            onClick={() =>
                                              isSmallScreen &&
                                              setOpenSort(false)
                                            }
                                            className="text-decoration-none fw-bold text-capitalize text-secondary"
                                            to={`/kitchen/${id}?category=${c}`}
                                          >
                                            {' '}
                                            {c}
                                          </Link>
                                        </InputGroup.Text>
                                      </InputGroup>
                                    ))}
                                  </Form>
                                </div>
                              </div>
                            </ListGroup.Item>
                          </div>
                        )}
                      </ListGroup>
                    </div>
                  </div>
                </Col>
                <Col
                  md={9}
                  className={isSmallScreen ? 'm-2  ' : ''}
                  style={{
                    borderLeft: !isSmallScreen ? '1px solid grey' : '',
                    minHeight: '80vh',
                    overflowX: 'scroll',
                    width: isSmallScreen ? '100vw' : '',
                  }}
                >
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      300: 1,
                      350: 2,
                      750: 2,
                      1000: 3,
                    }}
                  >
                    <Masonry gutter="10px">
                      {(loading
                        ? Array.from(new Array(9))
                        : kitchenData?.products
                      )?.map((item, index) => (
                        <div key={index}>
                          {item ? (
                            <Link
                              to={`/product/${item._id}`}
                              style={{ maxHeight: '270px', minHeight: '270px' }}
                              className="text-decoration-none rounded kitchhovering"
                              key={`${item._id}-${index}`}
                            >
                              <Cards item={item} />
                            </Link>
                          ) : (
                            <Box sx={{ pt: 0.5 }}>
                              <Skeleton height={250} />
                              <Skeleton width="60%" />
                              <Skeleton width="60%" />
                              <Skeleton width="60%" />
                            </Box>
                          )}
                        </div>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kitchen;
