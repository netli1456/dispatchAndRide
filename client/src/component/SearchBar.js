import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingBox from '../LoadingBox';
import Skeleton from '@mui/material/Skeleton';

function SearchBar({ bg }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const location = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
        );
        setSuggestions(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          toast.error('too many requests', {
            autoClose: 300,
            theme: 'light',
            toastId: 'unique-toast-id',
          });
        } else {
          toast.error('failed loading suggestions ' + error, {
            autoClose: 300,
            theme: 'light',
            toastId: 'unique-toast-id',
          });
          console.log('ERROR', error);
        }
        setLoading(false);
      }
    } else {
      setSuggestions('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    
   
      navigate(query `/search?query=${query}` );
    
  };

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
            value={query}
            className="border border-success"
            onChange={handleInputChange}
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
            value={query}
            className="border border-success"
            onChange={handleInputChange}
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

      <div
        style={{ position: 'absolute', top: 50, width: '100%' }}
        className={suggestions.length > 0 ? " locationBg p-2" : " p-2"}
      >
       <span className=''>
       {loading && <Skeleton width='60%' className='m-auto'/>}
       </span>

        {suggestions.length > 0 && (
          <ul style={{ width: '80%', margin: 'auto' }}>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ cursor: 'pointer' }}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
