import {useStrings} from '^/Services/useCustomHooks'
import FragmentedString from '%/Common/FragmentedString';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import PageTitle from '%/Common/PageTitle';
import NewProducts from '%/NewProducts';
import SpecialProducts from '%/SpecialProducts';
import {Container} from '@bootstrap-styled/v4';

const Home = ({name}) => {
  const cStrings = useStrings(name);
  const currentMonth = (new Date()).toLocaleString('default', {month: 'long'});
  const newTitle = <FragmentedString string={cStrings.newProducts} params={{currentMonth}}></FragmentedString>;
  const specialsTitle = <FragmentedString string={cStrings.specialProducts} params={{currentMonth}}></FragmentedString>;
  return (
    <Container>
      <Header />
      <NewProducts>
        <PageTitle headings={{title: newTitle}}></PageTitle>
      </NewProducts>
      <SpecialProducts>
        <PageTitle headings={{title: specialsTitle}}></PageTitle>
      </SpecialProducts>
      <Footer />
    </Container>
  );
}

Home.defaultProps = {
  name: Home.name
}

export default Home;
