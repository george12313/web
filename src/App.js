import React from 'react';
import Web3Integration from './components/Web3Integration';

const App = () => {
  const handleDeposit = (result) => {
    console.log('Deposit Result:', result);
  };

  return (
      <div>
        <h1>Deposit App</h1>
        <Web3Integration onDeposit={handleDeposit} />
      </div>
  );
};

export default App;
