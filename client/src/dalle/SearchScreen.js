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
import Button from 'react-bootstrap/esm/Button';
import { searchSuccess } from '../redux/searchSlice';
import { useDispatch, useSelector } from 'react-redux';

function SearchScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'all';
  // const page = sp.get('page') || 1;

  const [page, setPage]=useState(1)

  const [products, setProducts] = useState([]);
  const location = useLocation();
  const handlePageChange = () => {
   

    setPage(page +1)
  };

  const { searchproducts } = useSelector((state) => state.searching);
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname !== '/') {
      const handleSearch = async () => {
        try {
          const { data } = await axios.get(
            `${api}/api/users?query=${query}&page=${page}`
          );
          setProducts(data)
        } catch (error) {
          console.log(error);
        }
      };
      handleSearch();
    }
  }, [query, page, location, dispatch, ]);


  return (
    <div className="">
      <Navbar />
      <SearchBar />

      <div className="search-results">
        <p className="fw-bold">
          {products?.length} kitchens selling{' '}
          <span className="border-bottom border-primary text-danger">
            {query !== 'all' ? query : ''}
          </span>{' '}
          near you found
        </p>
      </div>
      <Container>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
          <Masonry>
            {products?.length > 0 && products?.map((item, index) => (
              <Link
                to={`/kitchen/${item._id}`}
                className="text-decoration-none listings border-bottom  p-2"
                key={`${index}-${item._id}`}
              >
                {' '}
                <SearchedItems item={item} />
              </Link>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </Container>

      <div className="navigation-button">
        <Button onClick={() => handlePageChange(page + 1)} className="button1">
          see more
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default SearchScreen; // Export the component
