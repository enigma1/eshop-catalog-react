import {useStartup, useSequence} from '^/Services/useCustomHooks'
//import Dummy from '%/Common/Dummy';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import ListManufacturers from '%/ListManufacturers';
import {Container} from '@bootstrap-styled/v4';

const act = {
  setLocation: {
    type: 'setLastLocation'
  },
  getManufacturer: {
    type: 'getLocationID',
    data: {id: 'manufacturers_id'}
  }
};

const Manufacturers = ({services, location, name}) => {
  const {state, stateDispatch, middleware} = useStartup(services, {}, name);
  const [utilsDispatch, historyDispatch] = middleware;

  const setManufacturer = (mid) => {
    stateDispatch({data:{mid}})
  }

  useSequence([
    [historyDispatch, act.setLocation],
    [utilsDispatch, act.getManufacturer, setManufacturer],
  ],[location.search]);

  const {mid} = state;

  return (
  <Container>
    <Header></Header>
    <ListManufacturers mid={mid}></ListManufacturers>
    <Footer></Footer>
  </Container>
  );
}

Manufacturers.defaultProps = {
  name: Manufacturers.name,
  services: ['utils', 'history']
}

export default Manufacturers;
