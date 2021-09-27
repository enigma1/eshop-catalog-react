// import {render} from './common.js';
import './common.js';
// import {getByTestId, getByText} from '@testing-library/dom';
import {cleanup, fireEvent, render} from '@testing-library/react';

import {
  toBeInTheDocument,
  toHaveClass,
} from '@testing-library/jest-dom/matchers'
expect.extend({toBeInTheDocument, toHaveClass})

import ListProducts from '^/Modules/ListProducts';
import SearchProducts from '^/Modules/SearchProducts.js';

jest.mock('^/Style/Cards', () => (props) => <div id="CardsM"></div>);
// jest.mock('@bootstrap-styled/v4/lib/Cards', () => (props) => <div id="Card1"></div>);
// jest.mock('@bootstrap-styled/v4/lib/Button', () => (props) => <div id="Button1"></div>);

const mockSearchProducts = jest.fn();

jest.mock('^/Modules/SearchProducts', () => {
  return jest.fn().mockImplementation( (props) => {
    return (
      <span data-testid="SearchProducts1" id="SearchProducts1"></span>
    );
  });
});


jest.mock('@bootstrap-styled/v4/lib/Collapse',
  () => (props) => {
    const status = `SearchProducts-${props.isOpen?'open':'closed'}`;
    return(
      <span id={status}>{status}</span>
    );
  });


beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  //SearchProducts.mockClear();
  //mockSearchProducts.mockClear();
});

describe('Make Snapshots', () => {
  const component = TestRenderer.create(
    <ListProducts></ListProducts>
  );

  let tree = component.toJSON();
  // Generates snapshot here if it doesn't exist otherwise it tests against the existing one
  expect(tree).toMatchSnapshot();
});

describe('Testing DOM Logic', () => {
  test('List Products', () => {
    const {getByText} = render(<ListProducts />);
    const button = getByText('Search');
    fireEvent.click(button);
    // console.log(container.outerHTML);

    expect(
      document.getElementById('SearchProducts-open')
    ).toBeInTheDocument();

    fireEvent.click(button);

    expect(
      document.getElementById('SearchProducts-closed')
    ).toBeInTheDocument();

    //console.log('mockTest', mockTest);
    //const mockTest = document.querySelector('span#SearchProducts1');

    //expect(getByTestId(mockTest, 'SearchProducts-closed')).toBeInTheDocument();
    //expect(getByText('SearchProducts-closed')).toBeInTheDocument();
    // To test against DOM
  });
});

describe('Testing React Logic', () => {
  test('List Products', () => {

    const component = TestRenderer.create(
      <ListProducts></ListProducts>
    );

    let ci = component.getInstance();
    ci.setState({toggleSearch: false, listProducts: []});

    // const mockTest = document.getElementById('SearchProducts-closed');
    ci.setupList([]);

    expect(ci.state.toggleSearch).toBe(false);
    ci.toggleForm({});
    expect(ci.state.toggleSearch).toBe(true);
  });
});
