import { Link, NavLink as NavRouterLink } from 'react-router-dom';
import {useSequence, useStartup} from '^/Services/useCustomHooks';

import {
  DropdownMenu,
  DropdownItem,
} from '@bootstrap-styled/v4';

const act = {
  getCategories: () => ({
    type: "viewCategories",
    data: {
      cmd: `view=listing&key=["parent_id", "0"]`
    }
  })
};

const ParentCategories = ({categories}) => <>
  {categories.map( ({value}) =>
    <DropdownItem key={value.id}>
      <NavRouterLink className="nav-link" to={`/categories/?categories_id=${value.id}`}>{value.name}</NavRouterLink>
    </DropdownItem>
  )}
</>

const HeaderCategories = ({name, children}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup('api', {categories: []}, name);

  const setCategories = (categories) => {
    if(categories && categories.rows) {
      stateDispatch({categories: categories.rows, ready: true})
    }
  }

  useSequence([
    [apiDispatch, act.getCategories(), setCategories],
  ], []);

  const {categories} = state;

  return (<>
    <DropdownMenu>
      <DropdownItem header>
        <NavRouterLink className="nav-link" to="/categories">{cStrings.rootCategories}</NavRouterLink>
      </DropdownItem>
      <DropdownItem divider />
      <ParentCategories categories={categories} />
      {children}
    </DropdownMenu>
  </>)
}

HeaderCategories.defaultProps = {
  name: HeaderCategories.name
}

export default HeaderCategories;
