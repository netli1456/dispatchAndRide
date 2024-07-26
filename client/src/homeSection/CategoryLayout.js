import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SetMealIcon from '@mui/icons-material/SetMeal';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import './homePage.css'; // Adjust the path as needed
import { NearMe, DinnerDining, RiceBowl, Icecream } from '@mui/icons-material'; // Replace with actual icons
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';

function CategoryLayout(props) {
  const categories = [
    {
      name: 'Near me',
      icon: <NearMe />,
      position: { top: '22%', left: '32%' },
    },
    {
      name: 'Sea-Food',
      icon: <SetMealIcon />,
      position: { top: '35%', left: '62%' },
    },
    {
      name: 'Desert',
      icon: <DinnerDining />,
      position: { top: '55%', left: '52%' },
    },

    {
      name: 'Local',
      icon: <RiceBowl />,
      position: { top: '55%', left: '12%' },
    },
    {
      name: 'Ice-cream',
      icon: <Icecream />,
      position: { top: '35%', left: '2%' },
    },
    {
      name: 'Swallow',
      icon: <TakeoutDiningIcon />,
      position: { top: '39%', left: '32%' },
    }, // Center item
  ];

  const navigate = useNavigate();
  const { searchedLocation } = useSelector((state) => state.searching);
  const {setOpen}=props


  const handleFilter = (filterData) => {
    if (filterData !== 'Near me') {
      navigate(`/search?&popularFilter=${filterData}`);
    } else {
      if (searchedLocation) {
        navigate(`/search?&searchedLocation=${searchedLocation}`);
      }else{
        setOpen(true)
      }
    }
  };
console.log('searchLocat', searchedLocation)
 
  return (
    <div>
      <div className="category-container">
        {categories.map((category, index) => (
          <Button
            onClick={() => handleFilter(category.name)}
            variant="grey"
            to={`/${category.name.replace(/ /g, '-').toLowerCase()}`}
            key={index}
            className={`category-item text-white bt  fw-bold `}
            style={category.position}
          >
            <div className="category-icon">{category.icon}</div>
            <div>{category.name}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default CategoryLayout;
