import {Redirect} from 'react-router-dom';
import {useStartup, useSequence} from '^/Services/useCustomHooks';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import PageTitle from '%/Common/PageTitle';
import {Container} from '@bootstrap-styled/v4';

const act = {
  isLogged: {
    type: 'isLoggedIn'
  },
  logoutCustomer: {
    type: 'unsetCustomer'
  }
};

const Logout = ({service, name}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  const setLogged = (mode=false) => {
    console.log('test', mode)
    if(!mode) {
      stateDispatch({type:'reset', data:{redirect: true}});
    }
  }

  useSequence([
    [apiDispatch, act.isLogged, setLogged],
    [apiDispatch, act.logoutCustomer],
    [stateDispatch]
  ],[]);

  const {redirect} = state;

  return (<>
    {redirect && <Redirect to="/" />}
    <Container>
      <Header></Header>
      <PageTitle headings={cStrings}></PageTitle>
      <Footer></Footer>
    </Container>
  </>);
}

Logout.defaultProps = {
  name: Logout.name,
  service: 'customer'
}

export default Logout;
