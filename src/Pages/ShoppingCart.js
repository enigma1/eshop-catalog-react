import {useStartup, useSequenceOnce} from '^/Services/useCustomHooks'
import Header from '%/Common/Header'
import Footer from '%/Common/Footer'
import PageTitle from '%/Common/PageTitle'
import CartContents from '%/CartContents'
import {Container} from '@bootstrap-styled/v4'

const act = {
  setLocation: {
    type: 'setLastLocation'
  }
};

const ShoppingCart = ({service, name}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  useSequenceOnce([
    [apiDispatch, act.setLocation],
    [stateDispatch],
  ])

  return (<>
    <Container>
      <Header></Header>
      <PageTitle headings={cStrings}></PageTitle>
      <CartContents></CartContents>
      <Footer></Footer>
    </Container>
    </>);
}

ShoppingCart.defaultProps = {
  name: ShoppingCart.name,
  service: 'history',
}
export default ShoppingCart;