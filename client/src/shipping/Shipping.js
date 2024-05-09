import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useDispatch, useSelector } from 'react-redux';

import { shippingSuccess } from '../redux/shippingSlice';
import { toast } from 'react-toastify';

function Shipping({ setShipOpen }) {
  const { shipping } = useSelector((state) => state.shippingAddress);
  const [name, setName] = useState(shipping?.name || '');
  const [localGvt, setLocalGvt] = useState(shipping?.localGvt || '');
  const [country, setCountry] = useState(shipping?.country || '');
  const [street, setStreet] = useState(shipping?.street || '');
  const [state, setState] = useState(shipping?.state || '');
  const [phoneNumber, setPhoneNumber] = useState(shipping?.phoneNumber || '');

  const dispatch = useDispatch();

  const handleShipping = async (e) => {
    e.preventDefault();
    if (name || localGvt || phoneNumber || country || street || state) {
      dispatch(
        shippingSuccess({ name, localGvt, phoneNumber, country, street, state })
      );
      setShipOpen(false);
      toast.success("Shipping Info Updated", {autoClose:1000, position:"top-center", theme: "light", toastId:"unique-toast-id"});
    } else {
      toast.error("Fill in the missing fields", {autoClose:5000, theme: "colored", toastId:"unique-toast-id"});
    }
  };

  

  return (
    <div className="mt-5">
      <Card
       
        style={{ maxWidth: '600px', minWidth: '400px', height: '85vh' }}
      >
        <Card.Body>
          <div>
            <div
              className="d-flex justify-content-center my-5 flex-column align-items-center"
              style={{ width: '100%' }}
            >
              <strong className="fs-4">Shipping Info</strong>
              <Form onSubmit={handleShipping}>
                <InputGroup className="my-3">
                  <InputGroup.Text className="fw-bold">Name</InputGroup.Text>
                  <Form.Control
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required={true}
                    placeholder=" write name here"
                  />
                </InputGroup>

                <InputGroup className="my-3">
                  <InputGroup.Text className="fw-bold">
                    Local-Gvt-Area
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    onChange={(e) => setLocalGvt(e.target.value)}
                    required={true}
                    placeholder=" write LGA here"
                  />
                </InputGroup>
                <InputGroup className="my-3">
                  <InputGroup.Text className="fw-bold">State</InputGroup.Text>
                  <Form.Control
                    type="text"
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder=" write state here"
                  />
                </InputGroup>
                <InputGroup className="my-3">
                  <InputGroup.Text className="fw-bold">Country</InputGroup.Text>
                  <Form.Control
                    type="text"
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="write country here"
                  />
                </InputGroup>
                <InputGroup className="my-3">
                  <InputGroup.Text className="fw-bold">
                    PhoneNumber
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder=" write number here"
                  />
                </InputGroup>
                <InputGroup className="my-3">
                  <InputGroup.Text className="fw-bold">Street</InputGroup.Text>
                  <Form.Control
                    type="text"
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </InputGroup>

                <div className="d-flex gap-3 align-items-center my-3">
                  <Button
                    variant="danger"
                    className="bg-danger fw-bold"
                    onClick={() => setShipOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    className="bg-success fw-bold"
                    type="submit"
                  >
                    Confirm
                  </Button>
                </div>
              </Form>

            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Shipping;
