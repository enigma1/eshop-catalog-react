import {useStartup, useSequenceOnce} from '^/Services/useCustomHooks'
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import SpecialProducts from '%/SpecialProducts';
import FragmentedString from '%/Common/FragmentedString';
import {
  H3, Container
} from '@bootstrap-styled/v4';

const act = {
  setLocation: {
    type: 'setLastLocation'
  }
};

const Specials = ({service, name}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  useSequenceOnce([
    [apiDispatch, act.setLocation],
    [stateDispatch, {currentMonth: (new Date()).toLocaleString('default', {month: 'long'})}],
  ])

  const {currentMonth} = state;

  return(
    <Container>
      <Header></Header>
      <SpecialProducts specialsLimit={100}>
        <H3 className="border p-3 bg-heading text-heading mt-2">
          <FragmentedString string={cStrings.title} params={{currentMonth}}></FragmentedString>
        </H3>
      </SpecialProducts>
      <Footer></Footer>
    </Container>
  );
}

Specials.defaultProps = {
  name: Specials.name,
  service: 'history',
}

export default Specials;