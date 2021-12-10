import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {BoardState, ChipAction, startBoard} from "./boardHelper";


const initialState: BoardState = {
    selectedChip: undefined,
    board: startBoard,
}

export const handleClickOnField = createAsyncThunk<number | undefined, void, {state:RootState, dispatch:Dispatch}>(
    'fieldClickHandler',
    (_, {getState, dispatch}) => {

    return 1;
    })


export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        selectField: (state, {payload}: PayloadAction<number>) => {
            if (!state.selectedChip) {
                state.selectedChip = payload;
                return
            }
            if (state.selectedChip === payload) state.selectedChip = undefined;
        }
    },
    extraReducers: builder => {
        const isPlayersChip = (state:BoardState, {payload}: ChipAction) => {}
        builder
            .addCase(handleClickOnField.fulfilled, (state, {payload}:ChipAction) => {
                state.selectedChip = payload;
            })
    }
});

export const {selectField} = boardSlice.actions;

export const selectedChip = (state: RootState) => state.board.selectedChip;
export const selectBoard = (state: RootState) => state.board.board;
export default boardSlice.reducer;
