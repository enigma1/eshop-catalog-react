import {lazy, Suspense, useHistory} from 'react';
import {Redirect} from 'react-router-dom';
import {useSequence, useStartup} from '^/Services/useCustomHooks';

import {H1} from '@bootstrap-styled/v4';

const act = {
  getContents: {
    type: 'getContents'
  },
  viewPayment: (limit=100) => ({
    type: "viewPayment",
    data: {
      cmd: `view=listing&limit=${limit}`
    }
  })
};


const importPaymentModule = ({id}) => lazy(() =>
  import(`>/Payment/${id}`).catch(() => import('%/Common/Error'))
);

const AllPaymentModules = ({mods}) => <>{mods}</>

const CheckoutPayment = () => {

  return(<>

  </>)
}

CheckoutPayment.defaultProps = {
  name: CheckoutPayment.name,
  services: ['api', 'cart'],
 }

export default CheckoutPayment;