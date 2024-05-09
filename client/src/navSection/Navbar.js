import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import MenuIcon from '@mui/icons-material/Menu';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Badge from 'react-bootstrap/Badge';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListGroup from 'react-bootstrap/ListGroup';
import { clearUserInfo } from '../redux/userSlice';
import { clearCart } from '../redux/cartSlice';
import { clearShipping } from '../redux/shippingSlice';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [open, setOpen] = useState();

  const handleLogOut = () => {
    dispatch(clearUserInfo());
    dispatch(clearCart());
    dispatch(clearShipping());
    dispatch(clearUserInfo());
  };

  return (
    <div className="bg-success py-2" style={{width:"100%"}}>
      <Container className="text-white py-1 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3 align-items-center navbarIcon px-2">
          <MenuIcon className="fs-2 fw-bold" />
          <Link to="/" className="text-decoration-none text-dark">
            <strong className="fw-bold fs-5">M-bite</strong>
          </Link>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div
            onClick={() => navigate('/cart')}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <CircleNotificationsIcon
              className={
                location.pathname === '/cart'
                  ? 'fs-2 fw-bold  border border-white text-white color-white rounded'
                  : 'fs-2 fw-bold bor'
              }
            />

            <Badge
              pill
              bg="danger"
              
              style={{ position: 'absolute', right: -5, top: -2 }}
            >
              {cartItems?.length}
            </Badge>
          </div>
          {userInfo?.user?.firstname ? (
            <div
              className={
                location.pathname === '/profile'
                  ? 'd-flex border border-white rounded gap-1 align-items-center'
                  : 'd-flex bor gap-1 align-items-center'
              }
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <div className='d-flex align-items-center' onClick={()=>setOpen(!open)}>
                {' '}
                <AccountCircleIcon className="fs-2 fw-bold" />
                <span className="d-none d-md-flex fw-bold align-items-center text-capitalize">
                  {userInfo?.user?.firstname} <ArrowDropDownIcon />
                </span>
              </div>
              {open && (
                <ListGroup
                  style={{
                    position: 'absolute',
                    top: 35,
                    zIndex: 99,
                    right: 0,
                    minWidth: '200px',
                  }}
                  
                >
                  <ListGroup.Item>
                    <Link
                      to="/profile"
                      className="text-decoration-none text-success fw-bold d-flex flex-column align-items-center px-3"
                    >
                      Account
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Link className="text-decoration-none text-success fw-bold d-flex flex-column align-items-center">
                      Order History
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Link
                      className="d-flex flex-column align-items-center text-decoration-none text-success fw-bold pb-5"
                      onClick={handleLogOut}
                    >
                      LogOut
                    </Link>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </div>
          ) : (
            <Link className="text-white" to="/signin">
              Log-in
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Navbar;
