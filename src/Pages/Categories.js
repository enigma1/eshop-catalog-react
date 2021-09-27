import {useStartup, useSequence} from '^/Services/useCustomHooks'
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import ParentCategory from '%/Categories/ParentCategory';
import {Container} from '@bootstrap-styled/v4';

const act = {
  setLocation: {
    type: 'setLastLocation'
  },
  getCategory: {
    type: 'getLocationID',
    data: {id: 'categories_id'}
  }
};

const Categories = ({name, services, location}) => {
  const {state, stateDispatch, middleware} = useStartup(services, {}, name);
  const [utilsDispatch, historyDispatch] = middleware;

  const setCategory = (cid) => {
    stateDispatch({data:{cid}})
  }

  useSequence([
    [historyDispatch, act.setLocation],
    [utilsDispatch, act.getCategory, setCategory],
  ],[location.search]);

  const {cid} = state;

  return (
    <Container>
      <Header></Header>
        <ParentCategory cid={cid} />
      <Footer></Footer>
    </Container>
  );
}

Categories.defaultProps = {
  name: Categories.name,
  services: ['utils', 'history'],
}

export default Categories;
