import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import rootReducer from '../../store/reducers/rootReducer';
import Landing from './Landing';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);


function renderWithRedux(
  ui,
  { initialState, store = createStore(rootReducer, initialState) } = {},
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}


test('should render KNSEY header and subtitle', () => {
  const { getByText } = renderWithRedux(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
      </Switch>
    </BrowserRouter>,
  );
  expect(getByText('KNSEY')).toBeVisible();
  expect(getByText('Rank a city using your current location.')).toBeVisible();
});
