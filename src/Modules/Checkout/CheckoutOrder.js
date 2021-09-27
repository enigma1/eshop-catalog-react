import {lazy, Suspense, useHistory} from 'react';
import {Redirect} from 'react-router-dom';
import {useSequence, useStartup} from '^/Services/useCustomHooks';

const act = {
  getContents: {
    type: 'getContents'
  },
  viewPayment: (limit=100) => ({
    type: "viewTotals",
    data: {
      cmd: `view=listing&limit=${limit}`
    }
  })
};


const CheckoutOrder = () => {

  return(<>

  </>)
}

export default CheckoutOrder;