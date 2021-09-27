//import {useRef, useContext} from 'react';
import {useSequence, useStartup} from '^/Services/useCustomHooks';
import Override from '%/Override'
import ListProducts from '%/ListProducts';
import OfferPrice from '%/OfferPrice'

const act = {
  viewProducts: (limit) => ({
    type: "viewProducts",
    data: {
      cmd: `view=listing&limit=${limit}`
    }
  })
};

const NewProducts = ({name, newProductsLimit, service, children}) => {
  const {state, stateDispatch, apiDispatch, cStrings, cfg} = useStartup(service, {}, name);
  const limit = newProductsLimit || cfg.limit;

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
      <Override.Provider value={{componentReplacement: OfferPrice, replaceWhen: 'prices.special'}}>
        <ListProducts products={products} respond={['NewProducts.signalResults']}>
          {children}
        </ListProducts>
      </Override.Provider>
    }
  </>);
}

NewProducts.defaultProps = {
  name: NewProducts.name,
  service: 'api',
}
export default NewProducts;
