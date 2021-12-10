import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {BoardState, ChipAction, startBoard} from "./boardHelper";


const initialState: BoardState = {
    selectedChip: undefined,
    board: startBoard,
}

const playerHasChipsOnField = ({round, board}: RootState, fieldId: number | undefined) => {
    if (!fieldId) return undefined
    return board.board[fieldId][round.activePlayer] > 0;
}

export const handleClickOnField = createAsyncThunk<number | undefined, number, { state: RootState, dispatch: Dispatch }>(
    'fieldClickHandler',
    (fieldId, {getState, dispatch}) => {
//if chips kicked out selected = kickedout
        //if selected get free fields, if free move
        //if !selected select
        if (playerHasChipsOnField(getState(), fieldId)) {
            dispatch(selectField(fieldId));
        }
        return fieldId;
        // return fieldId;
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

        builder
            .addCase(handleClickOnField.fulfilled, (state, {payload}: ChipAction) => {
                console.log(payload)
            })
    }
});

export const {selectField} = boardSlice.actions;

export const selectedChip = (state: RootState) => state.board.selectedChip;
export const selectBoard = (state: RootState) => state.board.board;
export default boardSlice.reducer;
