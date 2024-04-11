import { Box, Skeleton } from '@mui/material';
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function AcctHistory(props) {
  const { history, userInfo, loadings } = props;
  return (
    <ListGroup
      variant="flush"
      className="bg-white px-3 border border-grey rounded"
    >
      {loadings ? (
        <Box sx={{ pt: 0.5 }}>
          <Skeleton width="100%" height={50} />
          <Skeleton width={300} height={50} />
          <Skeleton width={300} height={50} />
          <Skeleton width={300} height={50} />
          <Skeleton width={300} height={50} />
        </Box>
      ) : (
        <>
          {history && history.length > 0 ? (
            history.map((item, index) => (
              <ListGroup.Item className="mb-2">
                <span
                  key={index}
                  className={
                    item.buyerId === userInfo?.user._id
                      ? `text-success fw-bold`
                      : `fw-bold text-success`
                  }
                >
                  {item.buyerId === userInfo?.user._id
                    ? `-N${item?.amount.toFixed(2)}`
                    : `+N${item?.amount.toFixed(2)}`}{' '}
                  {item.buyerId === userInfo.user?._id
                    ? `successfully sent to ${
                        item.businessName.length > 9
                          ? `${item.businessName.slice(0, 7)}...`
                          : `${item.businessName}`
                      }`
                    : `successful Order from ${
                        item.buyerName.length > 9
                          ? `${item.buyerName.slice(0, 7)}...`
                          : `${item.buyerName}`
                      }`}
                </span>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="mb-2">
              your history is empty
            </ListGroup.Item>
          )}
        </>
      )}
    </ListGroup>
  );
}

export default AcctHistory;
