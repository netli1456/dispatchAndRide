import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';

import SearchBar from '../component/SearchBar';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import './profile.css';
import Footer from '../footerSection/Footer';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavSearch from '../navSection/NavSearch';
import { fetchSuccess } from '../redux/userSlice';
import { toast } from 'react-toastify';
import ProfileHeader from './ProfileHeader';
import { api } from '../utils/apiConfig';
import { Box, Skeleton } from '@mui/material';
const Profile = () => {
  const [data, setData] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [openWallet, setOpenWallet] = useState(false);
  const [open, setOpen] = useState(false);
  const [arl, Setarl] = useState(false);
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(null);
  const [loading, setLoading] = useState('page' || false);

  useEffect(() => {
    if (!userInfo.user?._id) {
      navigate(`/signin`);
    }
  });

  useEffect(() => {
    const handleAct = async () => {
      setLoadingBalance(true);
      try {
        const { data } = await axios.get(
          `${api}/api/users/acct/${userInfo.user?._id}`
        );
        setBalance(data);
        setLoadingBalance(false);
        
      } catch (error) {
        toast.error(error.response.data.message);
        setLoadingBalance(false);
      }
    };
  
    handleAct();
   
  }, [userInfo?.user?._id, data]);

  useEffect(() => {
    const handleOrder = async () => {
      setLoading('page');
      try {
        const { data } = await axios.get(
          `${api}/api/orders/allorders/${userInfo?.user?._id}`
        );
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    handleOrder();
  }, [userInfo?.user?._id]);

  const handleWalletDetails = async () => {
    setLoading('walletDetails');
    try {
      const { data } = await axios.get(
        `${api}/api/users/account/find/${userInfo?.user?._id}`
      );
      Setarl(data);
      setLoading(false);
      setOpenWallet(true);
    } catch (error) {
      toast.error(error.ressponse.data.message);
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    try {
      setLoading('createWallet');
      const { data } = await axios.post(
        `${api}/api/payment/create/${userInfo?.user?._id}`
      );

      Setarl(data);
      setOpenWallet(true);
      setOpen(false);

      dispatch(
        fetchSuccess({ ...userInfo, user: { ...userInfo.user, wallet: true } })
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <NavSearch />
      <Container >
        <ProfileHeader
          userInfo={userInfo}
          open={open}
          balance={balance}
          handleWalletDetails={handleWalletDetails}
          setOpen={setOpen}
          handleCreateWallet={handleCreateWallet}
          openWallet={openWallet}
          setOpenWallet={setOpenWallet}
          arl={arl}
          loading={loading}
          loadingBalance={loadingBalance}
        />

        <SearchBar />
        <div className="my-3 ">
          <div className="text-center mb-3 border-bottom border-grey">
            {' '}
            <strong className="text-success fw-bold ">
              New Orders
              <Badge pill bg="danger">
                {data?.length}
              </Badge>
            </strong>
          </div>
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}
          >
            <Masonry gutter="20px">
              {(loading === 'page' ? Array.from(new Array(2)) : data)?.map(
                (item, index) => (
                  <>
                    {item ? (
                      <Link
                        to={`/order/${item?._id}`}
                        key={`${index}-${item?.productId}`}
                        className="d-flex align-items-center imageCardParent   gap-2 "
                        style={{ position: 'relative' }}
                      >
                        <div className="cardImage">
                          <img
                            src={item?.imgs}
                            alt=""
                            style={{
                              objectFit: 'cover',
                              borderRadius: '10px 0px 0px 10px',
                            }}
                          />
                        </div>

                        <div className="fw-bold d-flex gap-1 flex-wrap">
                          {item?.content?.slice(0, 3).map((content, index) => (
                            <div className="text-dark" key={index}>
                              {
                                <span>
                                  {content ? (
                                    content.category === 'food' ? (
                                      `${content.quantity} plate of ${content.name}, `
                                    ) : content.category === 'meat' ? (
                                      ` ${content.quantity} pieces of ${content.name}, `
                                    ) : (
                                      `${content.quantity} pieces of ${
                                        content.name
                                      }${
                                        item.content?.length > 3 ? '...' : ''
                                      } `
                                    )
                                  ) : (
                                    <Skeleton />
                                  )}
                                </span>
                              }
                            </div>
                          ))}
                        </div>
                        <div className="opacity-40">
                          <img
                            src="https://wonderingfair.files.wordpress.com/2014/12/new-logo.gif"
                            alt=""
                            style={{
                              width: '40px',
                              height: '40px',
                              position: 'absolute',
                              top: 0,
                              right: 6,
                            }}
                          />
                        </div>
                      </Link>
                    ) : (
                      <div>
                        <Skeleton width="100%" height={100} />
                        <Box sx={{ pt: 0.5 }}>
                          <Skeleton />
                          <Skeleton width="60%" />
                        </Box>
                      </div>
                    )}{' '}
                  </>
                )
              )}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Profile;
