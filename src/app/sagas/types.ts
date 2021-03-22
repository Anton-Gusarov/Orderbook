import {Slice, SliceCaseReducers} from "@reduxjs/toolkit";

export enum SYMBOLS {
    BTC = 'tBTCUSD',
    LTC = 'tLTCUSD'
}
export type BookState = {
    bid: any[],
    ask: any[],
    symbol: SYMBOLS
}
export type RootState = {
    book: BookState
}
export type Chunk = [
    price: number,
    count: number,
    amount: number
]
export type BookSnapshot = Chunk[]
export interface OrderBook<BookSlices extends SliceCaseReducers<BookState>> extends Slice<BookState,BookSlices>{}
export type wsSubscribeParams = {
    event: 'subscribe',
    channel: 'book',
    symbol: SYMBOLS
}
