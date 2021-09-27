import {useStartup, useSequence} from '^/Services/useCustomHooks';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import PageTitle from '%/Common/PageTitle';
import PageDescription from '%/Common/PageDescription';
import {Container} from '@bootstrap-styled/v4';

 const Error = ({name, services}) => {
  const {state, stateDispatch, middleware, cStrings} = useStartup(services, {}, name);
  const [utilsDispatch] = middleware;

  console.log('error page loaded');
  return(
    <Container>
      <Header></Header>
      <PageTitle headings={cStrings}></PageTitle>
      <PageDescription contents={cStrings}></PageDescription>
      <Footer></Footer>
    </Container>
  )
}

Error.defaultProps = {
  name: Error.name,
  services: ['utils']
}

export default Error;
