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

const SpecialProducts = ({name, specialsLimit, service, children}) => {
  const {state, stateDispatch, apiDispatch, cStrings, cfg} = useStartup(service, {}, name);
  const limit = specialsLimit || cfg.limit;


  const setProducts = data => {
    data && data.rows && stateDispatch({
      products: data.rows.sort((i,j) => +i.value.sort - +j.value.sort)
    })
  }

  useSequence([
    [stateDispatch, {ready: false}],
    [apiDispatch, act.viewProducts(limit), setProducts],
    [stateDispatch, {ready: true}]
  ],[]);

  const {products, ready} = state;

  return (<>
    <Loading show={!ready}>
      <h2>{cStrings.loading}</h2>
    </Loading>
    {ready &&
      <Override.Provider value={{componentReplacement: SpecialPrice}}>
        <ListProducts products={products} respond={['SpecialProducts.signalResults']}>
          {children}
        </ListProducts>
      </Override.Provider>
    }
  </>);
}

SpecialProducts.defaultProps = {
  name: SpecialProducts.name,
  service: 'api'
}

export default SpecialProducts;
