import {all} from 'redux-saga/effects'
import fetchSaga from './fetch'
export default function* rootSaga() {
    yield all([
        fetchSaga()
    ]);
}
