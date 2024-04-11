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
import Error from '../utils/Error';
import { toast } from 'react-toastify';
import { api } from '../utils/apiConfig';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Spinners from '../utils/Spinner';

function SignUp() {
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [comfirmPassword, setComfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (comfirmPassword.toString() === password.toString()) {
      try {
        const { data } = await axios.post(`${api}/api/users/register`, {
          surname: surname,
          firstname: firstName,
          password: password,
          age: age,
          country: country,
          state: state,
          email: email,
        });
        dispatch(fetchSuccess(data));
        navigate('/');
        setLoading(false);
        toast.success(
          `welcome! ${data?.user?.surname} ${data?.user?.firstname}`,
          {
            autoClose: false,
            theme: 'light',
            toastId: 'unique-toast-id',
          }
        );
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: true,
          theme: 'colored',
          toastId: 'unique-toast-id',
        });
        setLoading(false);
      }
    } else {
      toast.error('password not match', {
        autoClose: true,
        theme: 'colored',
        toastId: 'unique-toast-id',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user?.firstname) {
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
          height: '840px',
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
        <div style={{ position: 'absolute', left: 0, width: '100vw', top: 10 }}>
          <Row className="">
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
              <strong className="mb-2">Sign Up</strong>
              <Form
                onSubmit={handleSignUp}
                className="bg-light p-2 border rounded-4"
              >
                <InputGroup className="my-3 ho border border-secondary ">
                  <InputGroup.Text className="titl">Surname</InputGroup.Text>
                  <Form.Control
                    className="inpu"
                    type="text"
                    required
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="my-3 ho border border-secondary  ">
                  <InputGroup.Text className="titl">First-Name</InputGroup.Text>
                  <Form.Control
                    className="inpu "
                    type="text"
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    placeHolders
                  />
                </InputGroup>
                <InputGroup className="my-3 ho border border-secondary  ">
                  <InputGroup.Text className="titl ">State</InputGroup.Text>
                  <Form.Control
                    className="inpu "
                    type="text"
                    required
                    onChange={(e) => setState(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="my-3 ho border border-secondary  ">
                  <InputGroup.Text className="titl">Country</InputGroup.Text>
                  <Form.Control
                    className="inpu "
                    type="text"
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="my-3 ho border border-secondary  ">
                  <InputGroup.Text className="titl">Age</InputGroup.Text>
                  <Form.Control
                    className="inpu "
                    type="Date"
                    required
                    onChange={(e) => setAge(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="my-3 ho border border-secondary ">
                  <InputGroup.Text className="titl">Email</InputGroup.Text>
                  <Form.Control
                    className="inpu "
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="my-3 ho border border-secondary  ">
                  <InputGroup.Text className="titl ">Password</InputGroup.Text>
                  <Form.Control
                    className=" inpu "
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="ho border border-secondary ">
                  <InputGroup.Text className="titl ">
                    Comfirm Password
                  </InputGroup.Text>
                  <Form.Control
                    className="inpu"
                    type="password"
                    required
                    onChange={(e) => setComfirmPassword(e.target.value)}
                  />
                </InputGroup>
                <div
                  className="d-flex align-items-center justify-content-center my-3"
                  style={{ position: 'relative' }}
                >
                  <Button
                    variant="success"
                    className="bg-success border fw-bold rounded-5 px-5"
                    type="submit"
                  >
                    Sign Up
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
                  Have an account ? <Link to="/signin"> sign in here</Link>
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

export default SignUp;
