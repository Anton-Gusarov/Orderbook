import React, {useReducer, useState} from 'react';
import logo from './logo.svg';
import {Counter} from './features/counter/Counter';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {createBook} from './features/counter/counterSlice';
import {SYMBOLS} from "./app/sagas/types";

const initialState = {symbol: SYMBOLS.BTC, label: 'Switch to LTC/USD'};
function switchS(symbol) {
    return symbol === SYMBOLS.BTC ? SYMBOLS.LTC : SYMBOLS.BTC
}

function App() {
    const [curS, setState] = useState(SYMBOLS.BTC);
    // @ts-ignore
    const nextS = useSelector(state=>state.book.symbol);
    const dispatch = useDispatch();
    const label = nextS !== curS ? 'Switching...' : `Switch to ${switchS(curS)}`;
    return (
        <div className="App">
            <header className="App-header">
                <button onClick={() => {setState(switchS(curS)); dispatch({type: 'cp'})}} style={{width: 300, height: 100}}>{label}
                </button>
                <Counter/>
            </header>
        </div>
    );
}

export default App;
