import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { render, cleanup } from '@testing-library/react'
import Landing from './Landing'
import reducer from '../../store/reducers/rootReducer'

afterEach(cleanup);

const store = createStore(reducer, {
});


test('should render with redux defaults', () => {
   const {container} = render(
   <Provider store={store}>
      <BrowserRouter>
         <Switch>
            <Route exact path='/' component={Landing} />
         </Switch>
      </BrowserRouter>
   </Provider>
   );
   expect(container.firstChild).toHaveClass('landing-container');
});