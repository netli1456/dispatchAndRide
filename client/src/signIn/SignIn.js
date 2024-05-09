import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from '../navSection/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footerSection/Footer';
import axios from 'axios';
import HttpsIcon from '@mui/icons-material/Https';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuccess } from '../redux/userSlice';

import { toast } from 'react-toastify';
import { api } from '../utils/apiConfig';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinners from '../utils/Spinner';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${api}/api/users/signin`, {
        email: email,
        password: password,
      });
      dispatch(fetchSuccess(data));

      toast.success(
        `Signed in as ${data?.user?.surname} ${data?.user?.firstname}`,
        {
          autoClose: true,
          theme: 'light',
          toastId: 'unique-toast-id',
        }
      );
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: true,
        theme: 'colored',
        toastId: 'unique-toast-id',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user?._id) {
      navigate('/');
    }
  });

  return (
    <div>
      <Navbar />
      <div
        style={{
          backgroundColor: 'lightgrey',
          overflowX: 'hidden',
          position: 'relative',
          height: '750px',
        }}
      >
        <img
          src="/mbite.jpeg"
          alt=""
          style={{
            width: '100%',
            opacity: '0.1',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{ position: 'absolute', left: 0, width: '100vw', top: 20 }}>
          <Row >
            <Col
              md={6}
              className="d-flex mb-3  justify-content-center  flex-column align-items-center"
            >
              <div
                className="bg-light p-3 border rounded-3 d-flex flex-column align-items-center"
                style={{ width: '100%' }}
              >
                <h3>Join M-Bite global market today</h3>
                <p>
                  {' '}
                  We are one of the fastest growing online market <br /> you can
                  buy and sell your products.
                  <br /> create a store today in a reliable enviroment tp sell
                  your products{' '}
                </p>
              </div>
            </Col>
            <Col
              md={6}
              className="d-flex  justify-content-center  flex-column align-items-center"
            >
              <Button
                variant="success"
                className="bg-success opacity-75 p-1"
                style={{ borderRadius: '50%' }}
              >
                <HttpsIcon />
              </Button>
              <strong className="mb-2">Sign In</strong>
              <Form
                onSubmit={handleLogin}
                className="bg-light px-5 border d-flex flex-column justify-content-center rounded-4"
                style={{ height: '50vh' }}
              >
                <InputGroup className="my- ho border border-secondary  ">
                  <InputGroup.Text className="titl ">Email</InputGroup.Text>
                  <Form.Control
                    className=" inpu "
                    type="text"
                    required
                    placeholder="write here"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="my-3 ho border border-secondary  ">
                  <InputGroup.Text className="titl ">Password</InputGroup.Text>
                  <Form.Control
                    className=" inpu "
                    type="password"
                    required
                    placeholder="write here"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>

                <div className="d-grid my-3" style={{ position: 'relative' }}>
                  <Button
                    variant="success"
                    className="bg-success fw-bold border rounded-5"
                    type="submit"
                  >
                    Login
                  </Button>
                  {loading && (
                    <div style={{ position: 'absolute', top: 2, left: '45%' }}>
                      {' '}
                      <Spinners />
                    </div>
                  )}
                </div>
              </Form>
              <div className="my-3">
                <strong>
                  {' '}
                  New customer ? <Link to="/signup"> sign up here</Link>
                </strong>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignIn;
