import {useSequence, useStartup} from '^/Services/useCustomHooks';

import ListProducts from '%/ListProducts';
import Override from '%/Override'
import SpecialPrice from '%/SpecialPrice'

const act = {
  viewProducts: (limit) => ({
    type: "viewProducts",
    data: {
      cmd: `view=specials&limit=${limit}`
    }
  })
};

const ShippingButtons = ({name, specialsLimit, children}) => {
  const {state, stateDispatch, apiDispatch, view, cfg} = useStartup('api', {}, name);
  const limit = specialsLimit || cfg.limit;

  const setView = (result) => {
    const sortedProducts = result.rows.sort((i,j) => +i.value.sort - +j.value.sort);
    view.products = sortedProducts;
  }

  useSequence([
    [apiDispatch, act.viewProducts(limit), setView],
    [stateDispatch, {ready: true}]
  ],[]);

  const {products} = view;

  return (<>
    <Loading show={!state.ready}>
      <h2>Loading Special Products</h2>
    </Loading>
    {state.ready &&
      <Override.Provider value={{componentReplacement: SpecialPrice}}>
        <ListProducts products={products} respond={['SpecialProducts.signalResults']}>
          {children}
        </ListProducts>
      </Override.Provider>
    }
  </>);
}

ShippingButtons.defaultProps = {
  name: SpecialProducts.name
}

export default ShippingButtons;
