import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useLocation, useNavigate } from 'react-router-dom';


function SearchBar(props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const location = useLocation();
  
  const {setOpenLocation, bg}=props
  

  

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname === `/riders`) {
      navigate(query ? `/riders?query=${query}` : '/riders');
    } else {
      navigate(query ? `/search?query=${query}` : '/search');
    }
  };

  return (
    <div style={{ width: '100%', position: 'relative' }} className="">
      <div
        className={
          bg
            ? 'search-ba d-none d-md-flex justify-content-center'
            : 'search-bar d-none d-md-flex justify-content-center'
        }
      >
        <InputGroup className="mb-3 searchba" style={{ width: '80%' }}>
          <Form.Control
            placeholder={
              location.pathname === '/'
                ? 'Write your address'
                : 'write something here!'
            }
            aria-describedby="search"
            id="search"
            onChange={(e)=> setQuery( e.target.value)}
            className="border border-success"
            
            readOnly={location.pathname === '/'}
            onClick={()=> location.pathname === '/' &&  setOpenLocation(true)}
            
          />
          <Button
            onClick={handleSearch}
            variant="success"
            id="basic-addon1"
            className=" text-white fw-bold d-flex align-items-center"
          >
            <SearchOutlinedIcon />
            Search
          </Button>
        </InputGroup>
      </div>
      <div
        className={
          bg
            ? 'd-md-none search-ba  d-flex justify-content-center'
            : 'd-md-none search-bar  d-flex justify-content-center'
        }
      >
        <InputGroup className=" searchba">
          <Form.Control
            placeholder="write something here!"
            aria-describedby="search"
            id="search"
            onChange={(e)=>setQuery(e.target.value)}
            className="border border-success"
            readOnly={location.pathname === '/'}
            onClick={()=> location.pathname === '/' &&  setOpenLocation(true)}
           
          />
          <Button
            onClick={handleSearch}
            variant="success"
            className=" text-white border border-white fw-bold d-flex align-items-center"
          >
            <SearchOutlinedIcon />
          </Button>
        </InputGroup>
      </div>

     
    </div>
  );
}

export default SearchBar;
