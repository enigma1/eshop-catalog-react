import { Link, NavLink as NavRouterLink } from 'react-router-dom';
import {useStartup, useSequenceOnce} from '^/Services/useCustomHooks';
import HeaderTop from '%/Header/HeaderTop';
import HeaderBottom from '%/Header/HeaderBottom';
import HeaderCategories from '%/Header/HeaderCategories';
//import { withTheme } from 'styled-components';
import Logo from '~/drawing2.svg';

import {
  Nav,
  Navbar,
  NavbarBrand,
  NavDropdown,
  NavbarToggler,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Collapse,
  Container
} from '@bootstrap-styled/v4';

const act = {
  getCustomer: {
    type: 'getCustomer'
  }
};

const Header = ({service, name, children}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {
    navState: false,
    dropdowns: [false, false]
  }, name);

  const gotoRoute = (route) => {
    // console.log('history', );
    //const history = useHistory();
    // history.push(route);
  }

  const setName = ({nickName}) => {

  }

  const toggleNav = () => {
    stateDispatch({navState: !state.navState});
  }

  const toggleDropdowns = (id) => {
    stateDispatch(dropdowns[id] = !state.dropdowns[id]);
  }

  const {navState, dropdowns} = state;

  useSequenceOnce([
    [apiDispatch, act.getCustomer, setName],
    [stateDispatch],
  ])

  return (<>
    <HeaderTop />
    <Nav tag="div" className="container-fluid navbar-expand-lg navbar-light border bg-light">
      <NavbarToggler onClick={toggleNav} />
      <NavItem className="d-none d-lg-block">
        <NavRouterLink className="nav-link" to="/" className="navbar-brand">
          <Logo alt="My Logo" width="256" height="128"></Logo>
        </NavRouterLink>
      </NavItem>
      <Collapse className="collapse navbar-collapse" isOpen={navState}>
        <Nav tag="ul" className="navbar-nav mx-auto d-flex flex-lg-row flex-xl-row">
          <NavItem className="px-2">
            <NavRouterLink className="nav-link" to="/">{cStrings.home}<span className="sr-only">(current)</span></NavRouterLink>
          </NavItem>
          <NavItem className="px-2">
            <NavRouterLink className="nav-link" to="/new-products">{cStrings.newProducts}</NavRouterLink>
          </NavItem>
          <NavItem className="px-2">
            <NavRouterLink className="nav-link" to="/specials">{cStrings.specials}</NavRouterLink>
          </NavItem>
          <NavItem className="px-2">
            <NavRouterLink className="nav-link" to="/manufacturers">{cStrings.brands}</NavRouterLink>
          </NavItem>
          <NavItem className="px-2">
            <Dropdown isOpen={dropdowns[0]} toggle={() => toggleDropdowns(0)}>
              <DropdownToggle caret nav>Categories</DropdownToggle>
              <HeaderCategories></HeaderCategories>
            </Dropdown>
          </NavItem>
          <NavItem className="px-2">
            <Dropdown isOpen={dropdowns[1]} toggle={() => toggleDropdowns(1)}>
              <DropdownToggle caret nav>
                Popular
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>New Products</DropdownItem>
                <DropdownItem divider />
                <DropdownItem disabled>Disabled Category</DropdownItem>
                <DropdownItem>Enabled Category</DropdownItem>
                <DropdownItem header>Popular Categories</DropdownItem>
                <DropdownItem>Another Enabled Category</DropdownItem>
                <DropdownItem>Another Enabled Category2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>See All</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
        </Nav>
      </Collapse>
    </Nav>
    <HeaderBottom />
  </>);
}

Header.defaultProps = {
  name: Header.name,
  service: 'customer'
}

//export default withTheme(Header);
export default Header;
