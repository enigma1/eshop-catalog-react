import {lazy, Suspense, useHistory} from 'react';
import {Redirect} from 'react-router-dom';
import {useSequence, useStartup} from '^/Services/useCustomHooks';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import PageTitle from '%/Common/PageTitle';
import CheckoutCard from '>/CheckoutCard';
import CheckoutShipping from '>/CheckoutShipping';
import CheckoutPayment from '>/CheckoutPayment';
import CheckoutConfirmation from '>/CheckoutConfirmation';

import {H1, Container, Accordion, AccordionGroup} from '@bootstrap-styled/v4';

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

// const importShippingModule = ({id}) => lazy(() =>
//   import(`>/Shipping/${id}`).catch(() => import('%/Common/Error'))
// );

//const AllShippingModules = ({mods}) => <>{mods}</>

const Checkout = ({services, name}) => {
  const {state, stateDispatch, middleware, cStrings} = useStartup(services, {}, name);
  const [checkoutDispatch, cartDispatch] = middleware;

  /*
  const setContents = (contents) => {
    if(!Object.entries(contents).length) {
      stateDispatch({type:'reset', data:{redirect: true}});
    }
  }

  const setCost = (entry, cost) => {
    console.log('shipping:', entry, cost);
  };

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
*/

  const checkoutProcess = () => {
    console.log('accordion change')
  };

  const setContents = (contents) => {
    if(!Object.entries(contents).length) {
      stateDispatch({type:'reset', data:{redirect: true}});
    } else {
      stateDispatch()
    }
  }

  useSequence([
    [cartDispatch, act.getContents, setContents],
    //[checkoutDispatch, act.viewShipping(), setView],
  ],[]);

  const {redirect, currentStep} = state;

  return(<>
    {redirect && <Redirect to="/shopping-cart" />}
    <Container>
      <Header></Header>
      <PageTitle headings={cStrings}></PageTitle>
      <AccordionGroup activeAccordionName={currentStep} onChange={checkoutProcess}>
        <Accordion tag={CheckoutCard} headings={{title: cStrings.shippingTitle}}>
          <CheckoutShipping></CheckoutShipping>
        </Accordion>
        <Accordion tag={CheckoutCard} headings={{title: cStrings.paymentTitle}}>
          <CheckoutPayment></CheckoutPayment>
        </Accordion>
        <Accordion tag={CheckoutCard} headings={{title: cStrings.confirmationTitle}}>
          <CheckoutConfirmation></CheckoutConfirmation>
        </Accordion>
      </AccordionGroup>
      <Footer></Footer>
    </Container>
  </>);

  // return(<>
  //   {state.redirect && <Redirect to="/shopping-cart" />}
  //   <Container>
  //     <Header></Header>
  //     <H1 className="border p-3 bg-heading text-heading mt-2">{cStrings.title}</H1>
  //     <Suspense fallback={cStrings.fallback}>
  //       <AllShippingModules mods={mods} />
  //     </Suspense>
  //     <Footer></Footer>
  //   </Container>
  // </>)


};

Checkout.defaultProps = {
  name: Checkout.name,
  services: ['checkout', 'cart']
}

export default Checkout;
