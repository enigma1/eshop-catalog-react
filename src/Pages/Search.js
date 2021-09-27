import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import SearchQuery from '%/SearchQuery';
import ListProducts from '%/ListProducts';
import {Container} from '@bootstrap-styled/v4';

const Search = () =>
  <Container>
    <Header></Header>
    <SearchQuery>
      <ListProducts respond={['SearchQuery.signalResults','SearchQuery.moreResults']}></ListProducts>
    </SearchQuery>
    <Footer></Footer>
  </Container>

export default Search;