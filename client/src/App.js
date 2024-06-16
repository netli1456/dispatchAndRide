import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './homeSection/HomePage';
import Product from './singlePageSection/Product';
import Cart from './cartSection/Cart';
import Kitchen from './kitchenSection/Kitchen';
import SearchScreen from './dalle/SearchScreen';
import RidersPage from './dispatchRiders/RidersPage';
import RiderCard from './dispatchRiders/RiderCard';
import Profile from './profile/Profile';
import Order from './orderPage/Order';
import SignIn from './signIn/SignIn';
import SignUp from './signUp/Signup';
import { ToastContainer } from 'react-toastify';
import Testss from './component/Testss';
import Navbar from './navSection/Navbar';
import { useState } from 'react';
import LocationPage from './dalle/LocationPage';

function App() {
  const [open, setOpen] = useState(false);
  return (
    <BrowserRouter>
      <div style={{
        width: '100%',
        position: open ? 'relative' : '',
        height: open ? '100vh' : '',
        overflow: open ? 'hidden' : '',
      }}>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
        <div
          style={{ position: 'sticky', width: '100%', top: 0, zIndex: 9 }}
        >
          {' '}
          <Navbar openNow={open} setOpenNow={setOpen} />
        </div>


        {open === true && (
        <div
          style={{
            width: '100%',
            position: 'absolute',
            top: 0,
            height: '100vh',
          }}
          className=" d-flex justify-content-center align-items-center locationBg"
        >
          <LocationPage setOpen={setOpen} />
        </div>
      )}
        <Routes>
          <Route path="/" element={<HomePage setOpen={setOpen}/>} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/kitchen/:id" element={<Kitchen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/riders" element={<RidersPage />} />
          <Route path="/rider/:id" element={<RiderCard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test" element={<Testss />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
