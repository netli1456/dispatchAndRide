import React, { useEffect, useRef, useState } from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import ListGroup from 'react-bootstrap/ListGroup';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Button from 'react-bootstrap/esm/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPage(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { setOpenLocation } = props;
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([6.5244, 3.3792]);
  const [setZoom] = useState(13);
  const mapRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value?.length > 2) {
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
            autoClose: 3000,
            theme: 'light',
            toastId: 'unique-toast-id',
          });
        } else {
          toast.error('failed loading suggestions ' + error, {
            autoClose: 3000,
            theme: 'light',
            toastId: 'unique-toast-id',
          });
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
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);

    setZoom(15);
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 15);
    }
    // navigate(`/search?query=${query}`);
  };

  const [zoomMapdata, setZoomMapData] = useState('');

  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        const lat = center.lat;
        const lon = center.lng;

        axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          )
          .then((response) => {
            setZoomMapData(response.data.display_name);
            setMapCenter([lat, lon]);
          })
          .catch((error) => {
            console.error('Error fetching location name:', error);
          });
      },
    });

    return null;
  };

  return (
    <div
      className="location rounded"
      style={{
        width: isSmallScreen ? '100%' : '70%',
        height: isSmallScreen ? '100%' : '96%',
        margin: 'auto',
        overflow: 'hidden',
      }}
    >
      <div className="m-4 d-flex align-items-center  text-dark">
        <ArrowBackIosIcon
          className="text-secondary cursors"
          onClick={() => setOpenLocation(false)}
        />
        <div className="text-center w-100">
          {' '}
          <h3 className="ms-2 text-center">Add a delivery address</h3>
        </div>
      </div>
      <Row className="" style={{ height: '80%' }}>
        <Col md={6} className="">
          <InputGroup className="input-group-no-border mx-3">
            <AddLocationAltIcon className="text-success" />
            <Form.Control
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="search for cities, street district..."
              className="input-no-border"
              style={{ maxWidth: '80%' }}
            />
            {query?.length > 0 && <CloseIcon  onClick={()=>setQuery('')} className="text-secondary cursors" />}
          </InputGroup>

          <div>
            {' '}
            <ListGroup
              variant="flush"
              className={suggestions?.length > 0 ? ' locationB p-2' : ' p-2'}
              style={{ maxHeight: '500px', overflowY: 'auto' }}
            >
              {loading && (
                <span>
                  <Skeleton width="60%" className="m-auto" />
                </span>
              )}

              {suggestions?.length > 0 && (
                <div style={{ width: '80%', margin: 'auto' }}>
                  {suggestions.map((suggestion) => (
                    <ListGroup.Item
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: 'pointer' }}
                    >
                      {suggestion.display_name}
                    </ListGroup.Item>
                  ))}
                </div>
              )}
            </ListGroup>
          </div>
        </Col>
        <Col md={6}>
          <div style={{ height: '70%' }} className="">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '95%', width: '90%', margin: 'auto' }}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <Marker position={mapCenter}>
                <Popup>{query}</Popup>
              </Marker>
              <MapEvents />
            </MapContainer>
          </div>
          {zoomMapdata?.length > 0 && (
            <div className="d-flex gap-3 flex-column ">
              <span className=" text-succes fw-bold border-danger border-bottom">
                {zoomMapdata}
              </span>
              <Button
                onClick={() => setQuery(zoomMapdata)}
                variant="light"
                className="fw-bold mx-3 bg-success text-white"
              >
                Set As Current Location
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default LocationPage;
