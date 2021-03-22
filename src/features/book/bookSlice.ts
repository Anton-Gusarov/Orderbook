import {CaseReducer, createSlice, PayloadAction, SliceCaseReducers} from '@reduxjs/toolkit';
import {BookState, Chunk, OrderBook, SYMBOLS} from '../../app/sagas/types';

const initialState: BookState = {
  bid: [],
  ask: [],
  symbol: SYMBOLS.BTC
}
// If bookSlice extends than update types here
interface BookSlice extends SliceCaseReducers<BookState>{
  symbol: CaseReducer<BookState, PayloadAction<SYMBOLS>>,
  createBook: CaseReducer<BookState, PayloadAction<any>>,
  updateBook: CaseReducer<BookState, PayloadAction<Chunk>>
}
export const bookSlice: OrderBook<BookSlice> = createSlice({
  name: 'book',
  initialState,
  reducers: {
    symbol: (state: BookState, data: PayloadAction<SYMBOLS>) =>{
      state.symbol = data.payload;
    },
    createBook: (state: BookState, data: PayloadAction<any>) => {
      const [bid, ask] = data.payload.reduce(( [bid, ask], chunk )=>{
        if (chunk[2]<0) ask.push(chunk); else bid.push(chunk);
        return [bid, ask];
      }, [ [], []]);
      state.bid = bid;
      state.ask = ask;
      return state
    },
    updateBook: (state: BookState, action: PayloadAction<Chunk>) => {
      const chunk: Chunk = action.payload;
      // delete 0
      if (chunk[1]===0) {
        const ar = chunk[2] < 0 ? state.ask : state.bid;
        const i = ar.findIndex(v=>v[0]===chunk[0]);
        if (i<0)return state;
        ar.splice(i, 1);
        return state;
      }
      // upd and add
      const ar = chunk[2] < 0 ? state.ask : state.bid;
      const i = ar.findIndex(v=>v[0]===chunk[0]);
      if (i<0) {
        //add
        ar.push(chunk);
        return state;
      }
      ar[i] = chunk;
      return state
    }
  },
})

export const { createBook, updateBook, symbol } = bookSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

export default bookSlice.reducer;
