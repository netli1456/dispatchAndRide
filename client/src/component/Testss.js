import React from 'react';
import './test.css';
const Testss = () => {
  const items = [{ name: 'test' }, { name: 'test33' }, { name: 'test33' }, { name: 'test33' },{ name: 'test33' }, { name: 'test33' },{ name: 'test33' },{ name: 'test33' }];
  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <div key={index} className="grid-item">
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Testss;
