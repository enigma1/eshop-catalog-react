import {useRef} from 'react';
import {useStartup, useSequence, useSequenceOnce, useDefined} from '^/Services/useCustomHooks'

import FragmentedString from '%/Common/FragmentedString';
import ProductOption from '%/ProductInfo/ProductOption';
import ProductQuantity from '%/ProductInfo/ProductQuantity';
import Price from '%/Common/Price';
import {
  P,
  Button,
  Form,
  FormGroup,
  Fieldset,
  Legend,
} from '@bootstrap-styled/v4';

const act = {
  addCartItem: data => ({
    type: 'addCartItem',
    data
  }),
  getTokenName: {
    type: 'getTokenName'
  }
}

const OptionsList = ({refs, attrs, controlOption}) => Object.entries(attrs).map((inp, idx) => {
  const selectRef = refs[inp[0]];
  return (
    <ProductOption key={idx} optionHandler={controlOption} optionRef={selectRef}>{inp[0]}</ProductOption>
  );
});

const ProductBuyForm = ({name, pData, children, services}) => {
  const {state, stateDispatch, middleware, view, cStrings} = useStartup(services, {id: pData.id, qty: 1, price: pData.price}, name);
  const [cartDispatch, messagesDispatch] = middleware;

  view.refs = (attrs => {
    const result = {};
    for(let i in attrs) result[i] = useRef();
    return result;
  })(pData.attrs || {});

  const initialize = (attrs={}) => {
    view.attrs = [];
    for(let i in attrs) {
      view.attrs[i] = {
        values: [...attrs[i]],
        selected: null
      }
    }
  }

  const messagesToken = tokenName => view.messagesToken = tokenName;

  const getTotalPrice = (price, qty, attrs={}) => {
    const pq = +price * +qty;
    return Object.entries(attrs)
      .filter(attr => attr[1].extraPrice)
      .reduce( (previous, currentEntry) => {
        let current = currentEntry[1].extraPrice;
        if(/^\d+(\.\d+)?%$/.test(current) ) {
          const prc = parseFloat(current);
          current =  (+price*prc)/100
        }
        return (+previous || 0) + (+current * +qty || 0)
      }, pq);
  }

  const controlOption = (name, newValue, extraPrice) => {
    if(!newValue) {
      return  view.attrs[name].values;
    } else {
      view.attrs[name].selected = newValue;
      view.attrs[name].extraPrice = extraPrice || 0;
      stateDispatch();
    }
  };

  const controlQuantity = (newQty) => {
    if(!newQty) {
      return  state.qty;
    } else {
      stateDispatch({qty: newQty})
      //view.qty = newQty;
    }
  };

  const buyNow = () => {
    const {attrs, refs} = view;
    const {qty, price, id} = state;
    const selectedAttrs = {};
    const errors = [];

    for(const [key, value] of Object.entries(attrs)) {
      if(!attrs[key] || !attrs[key].selected) {
        const selectNode = refs[key].current;
        selectNode.setError && selectNode.setError(true);

        errors.push({
          type: 'danger',
          msg: <FragmentedString string={cStrings.notSelected} params={{key}}></FragmentedString>
        });
      } else{
        selectedAttrs[key] = attrs[key].selected;
      }
    }

    if(!errors.length) {
      view.request = act.addCartItem({
        id, price:getTotalPrice(price, qty, attrs),
        qty, attrs: selectedAttrs
      });
      view.trigger = Date.now();
      stateDispatch();
    } else {
      PubSub.publish(view.messagesToken, errors);
    }
  }

  const setCartResponse = (result) => {
    const name = pData.name;
    if(result.error) {
      PubSub.publish(view.messagesToken, {
        type: 'danger',
        msg: <FragmentedString string={cStrings.errorAddingItem} params={{name}}></FragmentedString>
      });
    } else {
      PubSub.publish(view.messagesToken, {
        type: 'success',
        msg: <FragmentedString string={cStrings.addedToCart} params={{name}}></FragmentedString>
      });
    }
  }

  // useSequence([
  //   [stateDispatch, {qty: 1}]
  // ])

  useSequenceOnce([
    [initialize, pData.attrs],
    [messagesDispatch, act.getTokenName, messagesToken],
  ])

  useDefined([
    [cartDispatch, view.request, setCartResponse]
  ], [view.trigger])

  const {attrs, refs} = view;
  const {price, qty} = state;
  const totalPrice = getTotalPrice(price, qty, attrs);
  const shouldShowOptions = Object.keys(attrs).length?true:false;
  return(<>
    <Form className="border p-2 bg-light flex-fill">
      <Fieldset className="text-center">
        <Legend>{shouldShowOptions?cStrings.priceAttributes:cStrings.price}<P className="text-danger">
          <Price>{totalPrice}</Price>
        </P></Legend>
        <ProductQuantity qtyHandler={controlQuantity}></ProductQuantity>
      </Fieldset>

      {shouldShowOptions &&
        <Fieldset>
          <Legend className="py-2 my-3 d-block border-bottom border-top">{cStrings.options}</Legend>
          <OptionsList refs={refs} attrs={attrs} controlOption={controlOption}></OptionsList>
        </Fieldset>
      }
      <Button onClick={buyNow} className="mt-4 text-center w-100">{cStrings.buy}</Button>
    </Form>
    {children}
  </>)
}

ProductBuyForm.defaultProps = {
  name: ProductBuyForm.name,
  services: ['cart', 'messages']
};

export default ProductBuyForm;
