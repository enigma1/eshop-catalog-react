import {Redirect} from 'react-router-dom';
import {useStartup, useSequence} from '^/Services/useCustomHooks';
import Meta from '%/Common/Meta';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import PageTitle from '%/Common/PageTitle';
import LoginForm from '%/Account/LoginForm';
import {Container} from '@bootstrap-styled/v4';

const act = {
  isLogged: {
    type: 'isLoggedIn'
  },
  getLocation: {
    type: 'getLastLocation'
  },
};

const Login = ({services, stateInit, name}) => {
  const {state, stateDispatch, middleware, view, cStrings} = useStartup(services, stateInit, name);
  const [customerDispatch, historyDispatch] = middleware;

  const setLogged = (mode=false) => {
    if(mode) {
      stateDispatch({type:'reset', data:{redirect: true}});
      return {abort: true}
    }
  }

  useSequence([
    [historyDispatch, act.getLocation, ({link}) => {view.lastLink=link}],
    [customerDispatch, act.isLogged, setLogged],
    [stateDispatch]
  ],[]);

  const {redirect} = state;
  const {lastLink} = view;

  return (<>
    {redirect && <Redirect to={lastLink} />}
    <Meta componentName={name} entries={cStrings.metaTags}></Meta>
    <Container>
      <Header></Header>
      <PageTitle headings={cStrings}></PageTitle>
      <LoginForm></LoginForm>
      <Footer></Footer>
    </Container>
  </>);
}

Login.defaultProps = {
  name: Login.name,
  services: ['customer', 'history'],
  stateInit: {redirect: false}
}

export default Login;