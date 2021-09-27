import {lazy, Suspense, useHistory} from 'react';
import {Redirect} from 'react-router-dom';
import {useSequence, useStartup} from '^/Services/useCustomHooks';

import {H1} from '@bootstrap-styled/v4';

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


const importTotalsModule = ({id}) => lazy(() =>
  import(`>/Totals/${id}`).catch(() => import('%/Common/Error'))
);

const AllTotalsModules = ({mods}) => <>{mods}</>


const CheckoutConfirmation = () => {

  return(<>

  </>)
}

export default CheckoutConfirmation;