import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { expectSaga } from 'redux-saga-test-plan';
import { put } from 'redux-saga/effects';
import saga from './app/sagas/fetch'
import reducer, {incrementAsync} from './features/counter/counterSlice'
const r = function (state, action) {
    console.log('wef')
    return reducer(state, action)
}
it('handles reducers and store state', () => {
    return expectSaga(saga)
        .withReducer(reducer)
        .hasFinalState({
            value: 2
        })
        .dispatch({type: 'incrementAsync', payload: 2})
        .run(1100);
});
test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
