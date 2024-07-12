import React, { useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { Link } from 'react-router-dom';

import AddCardIcon from '@mui/icons-material/AddCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';

import AcctHistory from './AcctHistory';
import { api } from '../utils/apiConfig';
import { Box, Skeleton } from '@mui/material';

function ProfileHeader(props) {
  const {
    userInfo,
    open,
    balance,
    handleWalletDetails,
    setOpen,
    handleCreateWallet,
    openWallet,
    setOpenWallet,
    loading,
    arl,
    
  } = props;

  const [history, setHistory] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [loadings, setLoadings] = useState(false);

  const handleHistorys = async () => {
    setLoadings(true);
    try {
      const { data } = await axios.get(
        `${api}/api/transactions/history/${userInfo.user._id}`
      );
      setHistory(data);
      setLoadings(false);
    } catch (error) {
      console.log(error);
      setLoadings(false);
    }
  };

  const formatBalance = (balance) => {
    if (!balance) return '';
  
  
    const fixedBalance = Number(balance).toFixed(2);
  

    return fixedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Row className="balance-inf my-2">
      <Col className=" p-3 border ">
        <h3 className="text-capitalize">
          Hello {userInfo?.user?.firstname ? userInfo?.user?.firstname : ''} !
        </h3>

        <Row className="d-flex  justify-content-between flex-wrap gap-3">
          {' '}
          <Col md={5} className="d-flex flex-column ">
            {' '}
            {!open && (
              <div className="d-flex flex-column mb-2">
                {' '}
                Available balance:
                {loading ? (
                  <Skeleton />
                ) : (
                  <strong>
                    {' '}
                    <strong> N{balance && formatBalance(balance)}</strong>
                  </strong>
                )}
              </div>
            )}
            {userInfo?.user?.wallet !== false ? (
              <div className="d-flex align-items-center gap-3">
                {' '}
                <Button
                  variant="success"
                  className="fw-bold d-none d-md-flex align-items-center"
                  onClick={handleWalletDetails}
                >
                  <AttachMoneyIcon />
                  Fund wallet
                </Button>
                <Button
                  variant="success"
                  className="fw-bold d-md-none d-flex align-items-center"
                  onClick={handleWalletDetails}
                >
                  <AttachMoneyIcon />
                  Deposit
                </Button>
                <Button
                  variant="white"
                  className="fw-bold border text-success border-success d-flex align-items-center"
                >
                  <AccountBalanceIcon className="text-dark" />
                  CashOut
                </Button>
              </div>
            ) : (
              <div>
                {' '}
                {!open && (
                  <Button
                    variant="success"
                    className="fw-bold d-flex gap-1 align-items-center"
                    onClick={() => setOpen(true)}
                  >
                    <AddCardIcon />
                    Create wallet
                  </Button>
                )}
                {open && (
                  <div
                    className="d-flex align-items-center justify-content-center flex-column gap-3 border border-success rounded p-1"
                    style={{ backgroundColor: 'lightgrey' }}
                  >
                    <Link className="fw-bold fs-5">Create a new wallet!</Link>
                    <strong style={{ fontSize: '12px' }}>
                      This is your personal wallet, which you can use to make
                      purchases on our platform. By clicking 'Okay', you agree
                      to our terms and conditions.
                    </strong>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        variant="white"
                        className="border-danger"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateWallet}
                        variant="danger"
                        className="bg-danger"
                      >
                        {loading === 'createWallet' ? <Skeleton /> : 'Ok'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
          <Col md={5} className="text-end  d-flex flex-column text-secondary">
            {!openWallet && (
              <div className="d-none d-md-block">
                <div className="position-relative">
                  <Button
                    onClick={() => {
                      handleHistorys();
                      setOpenHistory(!openHistory);
                    }}
                    variant="light mb-2 text-success"
                    style={{ cursor: 'pointer' }}
                  >
                    Transaction History
                    <ArrowDropDownIcon />
                  </Button>
                  {openHistory && (
                    <div
                      className="position-absolute  "
                      style={{ right: 0, top: 35, zIndex: 99 }}
                    >
                      <AcctHistory
                        loadings={loadings}
                        history={history}
                        userInfo={userInfo}
                      />
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    handleWalletDetails();
                    setOpenWallet(true);
                  }}
                  variant="success"
                  className="fw-bold"
                  style={{ width: 'fit-content' }}
                >
                  Wallet details
                </Button>
              </div>
            )}

            {openWallet && (
              <>
                {' '}
                {loading === 'walletDetails' ? (
                  <Box sx={{ pt: 0.5 }}>
                    <Skeleton width="60%" />
                    <Skeleton width="60%" />
                    <Skeleton height={109} />
                  </Box>
                ) : (
                  arl.accountNumber && (
                    <div
                      className="d-flex acct text-start flex-column text-secondary"
                      style={{ fontSize: '14px', minWidth: '100%' }}
                    >
                      <strong
                        variant=" text-success"
                        className="text-capitalize"
                      >
                        Name: {userInfo.user.name}
                      </strong>
                      <strong variant=" text-success">Bank: {arl.bank}</strong>
                      <strong variant=" text-success">
                        Account Number: {arl.accountNumber}
                      </strong>
                      <span
                        className="p-2 border rounded"
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'lightgrey',
                        }}
                      >
                        this account is generated for you to fund your wallet.{' '}
                        <br />
                        transaction made to this account will show up in your
                        wallet
                        <div className="text-end">
                          {' '}
                          <Button
                            onClick={() => setOpenWallet(false)}
                            variant="white"
                            className="border-success rounded"
                            style={{ width: 'fit-content' }}
                          >
                            close
                          </Button>
                        </div>
                      </span>
                    </div>
                  )
                )}
                {!loading === 'walletDetails' && !arl?.accountNumber && (
                  <div>
                    you do not have wallet to show. <Link>Create here</Link>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>

        <div></div>
      </Col>
    </Row>
  );
}

export default ProfileHeader;
