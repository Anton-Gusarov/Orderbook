import {configureStore, EnhancedStore, PayloadAction} from '@reduxjs/toolkit';
import counterReducer from '../features/book/bookSlice';
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga';
import rootSaga from './sagas';
import { RootState} from "./sagas/types";
const sagaMiddleware = createSagaMiddleware();
export const store: EnhancedStore<RootState, PayloadAction, ReadonlyArray<SagaMiddleware>> = configureStore({
  reducer: {
    book: counterReducer,
  },
  middleware: [sagaMiddleware]
});
sagaMiddleware.run(rootSaga);
