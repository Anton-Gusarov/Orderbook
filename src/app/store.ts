import { configureStore, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    book: counterReducer,
  },
  middleware: [sagaMiddleware]
});
sagaMiddleware.run(rootSaga);
export type RootState = ReturnType<typeof store.getState>;
