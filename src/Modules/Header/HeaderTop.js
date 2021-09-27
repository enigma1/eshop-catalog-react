import {NavLink as NavRouterLink} from 'react-router-dom';
import {useStrings} from '^/Services/useCustomHooks';
import CurrencySelect from '%/Common/CurrencySelect';
import SearchIcon from '^/Icons/search.svg';
import CartIcon4 from '^/Icons/cart4.svg';

import {
  H5
} from '@bootstrap-styled/v4';


const HeaderTop = () => {
  const cStrings = useStrings('HeaderTop');
  return(
    <div className="d-flex justify-content-end bg-heading border">
      <H5 className="align-self-center flex-fill pl-3">{cStrings.title}</H5>
      <NavRouterLink className="nav-link" to="/search">
        <SearchIcon width={24} height={24} />
      </NavRouterLink>
      <NavRouterLink className="nav-link" to="/shopping-cart">
        <CartIcon4 width={24} height={24} />
      </NavRouterLink>
      <CurrencySelect></CurrencySelect>
    </div>
  );
}

HeaderTop.defaultProps = {
  name: HeaderTop.name
};
export default HeaderTop;