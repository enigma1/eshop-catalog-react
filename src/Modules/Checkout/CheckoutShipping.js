import {lazy, Suspense, useHistory} from 'react';
import {Redirect} from 'react-router-dom';
import {useSequence, useStartup} from '^/Services/useCustomHooks';
import PageTitle from '%/Common/PageTitle';
import {
  ButtonGroup,
  Button,
  Container
} from '@bootstrap-styled/v4';

const act = {
  getContents: {
    type: 'getContents'
  },
  viewShipping: (limit=100) => ({
    type: "viewShipping",
    data: {
      cmd: `view=listing&limit=${limit}`
    }
  })
};

const importShippingModule = ({id}) => lazy(() =>
  import(`>/Shipping/${id}`).catch(() => import('%/Common/Error'))
);

const AllShippingModules = ({mods, handler, strings}) => {
  return(<>
    {mods}
    <ButtonGroup className="d-flex flex-row-reverse bg-buttons p-2 mb-4 btn-group" role="buttons" aria-label="Checkout Buttons">
      <Button onClick={handler} className="btn btn-primary align-self-end mx-1">{strings.next}</Button>
    </ButtonGroup>
  </>);
}

const CheckoutShipping = ({services, name, responseHandler}) => {
  const {state, stateDispatch, middleware, cStrings} = useStartup(services, {}, name);
  const [apiDispatch, cartDispatch] = middleware;

  const setContents = (contents) => {
    if(!Object.entries(contents).length) {
      stateDispatch({type:'reset', data:{redirect: true}});
    }
  }

  const setCost = (entry, cost) => {
    console.log('shipping:', entry, cost);
    stateDispatch({shippingEntry: entry, shippingCost: cost});

  };

  const setModule = () => {
    responseHandler(state.entry);
  }

  const setView = (mods) => {
    if(!mods || !mods.rows) return;
    const promisedShipping = mods.rows.map(entry => {
      const ShippingEntry = importShippingModule(entry);
      return <ShippingEntry key={entry.id} modData={entry} setCost={setCost} group="shipping"></ShippingEntry>
    });
    Promise.all(promisedShipping).then(mods => {stateDispatch({mods})})
  }

  useSequence([
    [cartDispatch, act.getContents, setContents],
    [apiDispatch, act.viewShipping(), setView],
  ],[]);

  const {mods} = state;

  return(<>
    {state.redirect && <Redirect to="/shopping-cart" />}
    <PageTitle headings={cStrings}></PageTitle>
    <Suspense fallback={cStrings.fallback}>
      <AllShippingModules mods={mods} strings={cStrings} />
    </Suspense>
  </>)
};

CheckoutShipping.defaultProps = {
  name: CheckoutShipping.name,
  services: ['api', 'cart']
}

export default CheckoutShipping;
