import {useHistory} from "react-router-dom";
import {useSequence, useStartup, usePubSub} from '^/Services/useCustomHooks';

import CartItem from '%/ShoppingCart/CartItem';
import CartHeader from '%/ShoppingCart/CartHeader';
import CartTotals from '%/ShoppingCart/CartTotals';
import CartButtons from '%/ShoppingCart/CartButtons';

import {P} from '@bootstrap-styled/v4';

const act = {
  getContents: () => ({
    type: 'getContents'
  }),
  getTotals: () => ({
    type: 'getTotalDetails'
  }),
  getTokenName: () => ({
    type: 'getTokenName'
  })
};

const ItemList = ({contents={}}) => Object.entries(contents).map(entry =>
  <CartItem key={entry[0]} cartData={entry}></CartItem>
 );

const CartContents = ({service, name, stateInit}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, stateInit, name);
  const history = useHistory();

  const setTotals = totals => {stateDispatch({totals})};
  const setContents = contents => {
    stateDispatch({
      contents,
      filled: contents && Object.entries(contents).length
    })
  }

  const updateCart = () => {
    stateDispatch({trigger: Date.now()})
  };

  const checkout = () => {
    // Validate few things
    history.push('/checkout');
  }

  usePubSub( () => {
    const tokenName = apiDispatch(act.getTokenName());
    return [tokenName, updateCart]
  });

  useSequence([
    [stateDispatch, {ready: false}],
    [apiDispatch, act.getContents(), setContents],
    [apiDispatch, act.getTotals(), setTotals],
    [stateDispatch, {ready: true}],
  ],[state.trigger]);

  const {contents, totals, ready, filled} = state;

  return (<>
    {ready && filled
      ? <>
        <CartHeader></CartHeader>
        <div className="d-flex flex-column bd-highlight">
          <ItemList contents={contents} />
          <CartTotals totals={totals}></CartTotals>
        </div>
        <CartButtons handlers={{checkout}}></CartButtons>
      </>
      : <>
        <P className="border p-3 bg-heading text-heading mt-2">{cStrings.empty}</P>
      </>
    }
  </>)
}

CartContents.defaultProps = {
  name: CartContents.name,
  service: 'cart',
  stateInit: {contents:{}, totals:{}, filled: true}
}

export default CartContents;
