// For stand-alone tests
import {create, act} from "react-test-renderer";

// For DOM based tests
import { render, unmountComponentAtNode } from "react-dom";
import { act as actDom } from "react-dom/test-utils";

// import {render} from './common.js';
import './common.js';
// import {getByTestId, getByText} from '@testing-library/dom';
//import {cleanup, fireEvent, render} from '@testing-library/react';

import {
  toBeInTheDocument,
  toHaveClass,
} from '@testing-library/jest-dom/matchers'
expect.extend({toBeInTheDocument, toHaveClass})


global.Loading = jest.fn().mockImplementation( ({show}) => {
  return (<>{show &&
    <div>Loading</div>
  }</>);
});

jest.mock('%/ListProducts');
jest.mock('^/Services/useCustomHooks', () => {
  return {
    useStartup:  jest.fn(),
    useSequence: jest.fn()
  }
});
import {useStartup, useSequence} from '^/Services/useCustomHooks';
import NewProducts from '%/NewProducts';
import ListProducts from '%/ListProducts';

// Note jest hoisting
// jest.mock('./components/Component', () => ({ Component: jest.fn() }));
// import { Component } from "./components/Component";

// Component.mockImplementation(() => <div>Mock</div>);

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);

  ListProducts.mockImplementation( ({products, children}) => {
    return (
      <span>Listed Products</span>
    );
  });

  useStartup.mockImplementation((context='common', schema={}, config) => {
    const result = {
      state: {},
      view: {current: schema},
      cfg: {limit: 10}
    }

    result.stateDispatch = ({ready}) => {
      result.state.ready = ready;
    }
    result.apiDispatch = (context) => () => Promise.resolve({context, products: ['Product A', 'Product B']});

    return result;
  })

});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('Component Flow', () => {
  test('On loading', () => {
    const component = create(
      <NewProducts limit={7}></NewProducts>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Initial New Products State - component should be loading', () => {
    actDom(() => {
      render(<NewProducts limit={9}></NewProducts>, container);
    });
    expect(container.textContent).toBe("Loading");
  });

  test('New Products State - component should be active', () => {
    useSequence.mockImplementation((requests) => {
      for(const [dispatch, data] of requests) {
        dispatch(data);
      }
    });
    actDom(() => {
      render(<NewProducts limit={11}></NewProducts>, container);
    });
    expect(container.textContent).toBe("Listed Products");
  })

  test('Final New Products State - products should be present', () => {
    ListProducts.mockImplementation( ({products, children}) => {
      return (
        <span>Listed Products</span>
      );
    });

    useSequence.mockImplementation((requests) => {
      for(const [dispatch, data] of requests) {
        dispatch(data);
      }
    });
    actDom(() => {
      render(<NewProducts limit={11}></NewProducts>, container);
    });
    expect(container.textContent).toBe("Listed Products");
  })

});

