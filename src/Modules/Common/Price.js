import {useStartup, useSequence, usePubSub} from '^/Services/useCustomHooks';

const act = {
  getTokenName: () => ({
    type: 'getTokenName'
  }),
  format: (data) => ({
    type: 'format',
    data
  })
};

const Price = ({price, children=price}) => {
  const {state, stateDispatch, apiDispatch, view} = useStartup('currency');

  const setPrice = (value) => {
    view.formattedPrice = value;
  }

  const update = () => {
    stateDispatch({trigger:Date.now()})
  };

  usePubSub( () => [
    [apiDispatch(act.getTokenName()), update]
  ]);

  useSequence([
    [apiDispatch, act.format({price: children}), setPrice],
    [stateDispatch],
    //[stateDispatch, {ready: true}],
    //[stateDispatch, {type: staging, price: children}],
  ],[state.trigger, children]);

  const {formattedPrice} = view;
  return <>{formattedPrice}</>
};

export default Price;

//import currency from '^/Services/currency'
//export default ({price, children=price}) => <>{currency.format({price:children})}</>
