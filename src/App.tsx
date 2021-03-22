import React, {useState} from 'react';
import {Book} from './features/book/Book';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {RootState, SYMBOLS} from "./app/sagas/types";

function switchS(symbol) {
    return symbol === SYMBOLS.BTC ? SYMBOLS.LTC : SYMBOLS.BTC
}

function App() {
    const [curS, setState] = useState<SYMBOLS>(SYMBOLS.BTC);
    const nextS = useSelector<RootState, SYMBOLS>(({book: {symbol}}) => symbol);
    const dispatch = useDispatch();
    const label = nextS !== curS ? 'Switching...' : `Switch to ${switchS(curS)}`;
    return (
        <div className="App">
            <header className="App-header">
                <button
                    disabled={nextS !== curS}
                    onClick={() => {
                        setState(switchS(curS));
                        dispatch({type: 'cp'})
                    }} style={{width: 300, height: 100}}>{label}
                </button>
                <Book/>
            </header>
        </div>
    );
}

export default App;
