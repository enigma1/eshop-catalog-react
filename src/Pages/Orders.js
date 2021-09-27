import {Redirect} from 'react-router-dom';
import {useStartup, useSequence} from '^/Services/useCustomHooks';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import PageTitle from '%/Common/PageTitle';
import AccountOrders from '%/Account/AccountOrders';
import {Container} from '@bootstrap-styled/v4';

const act = {
  isLogged: {
    type: 'isLoggedIn'
  }
};

const Orders = ({service, name}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  const setLogged = (mode=false) => {
    if(!mode) {
      stateDispatch({type:'reset', data:{redirect: true}});
    } else {
      stateDispatch()
    }
  }

  useSequence([
    [apiDispatch, act.isLogged, setLogged],
  ],[]);

  const {redirect} = state;

  return (<>
    {redirect && <Redirect to="/login" />}
    <Container>
      <Header></Header>
      <PageTitle headings={cStrings}></PageTitle>
      <AccountOrders></AccountOrders>
      <Footer></Footer>
    </Container>
  </>);
}

Orders.defaultProps = {
  name: Orders.name,
  service: 'customer'
}

export default Orders;