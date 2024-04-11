import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Button from 'react-bootstrap/Button';

function SearchKitchen(props) {
  const {id} = props;
  const [query, setQuery] = useState( '');
  const navigate = useNavigate();

  const handleQuery = async (e) => {
      e.preventDefault();
        navigate(query ? `/kitchen/${id}?query=${query}` : `/kitchen/${id}`);
    };
  return (
    <div>
         <div className={ "search-bar d-non d-flex justify-content-center"}>
        <InputGroup className="mb-3 " style={{ width: '80%' }}>
          <Form.Control
            placeholder="write your address here!"
            aria-describedby="search"
            id="search"
            className="border border-success"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Button
            onClick={handleQuery}
            variant="success"
            id="basic-addon1"
            className=" text-white fw-bold d-flex align-items-center"
          >
            <SearchOutlinedIcon />
            Search
          </Button>
        </InputGroup>
      </div>
    </div>
  )
}

export default SearchKitchen
