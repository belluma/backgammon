import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {BoardAction, BoardState, ChipAction, MoveAction, startBoard} from "./boardHelper";
import {getPossibleMoves, moveStone, playerHasChipsOnField} from "./moveChipsHelper";


const initialState: BoardState = {
    selectedChip: undefined,
    board: startBoard,
    possibleMoves: [],
    kickedChips: [0, 0]
}

export const handleClickOnField = createAsyncThunk<number | undefined, number, { state: RootState, dispatch: Dispatch }>(
    'fieldClickHandler',
    (fieldId, {getState, dispatch}) => {
        const {selectedChip} = getState().board
        if (selectedChip !== undefined && selectedChip !== fieldId) {
            dispatch(updateBoard(moveStone(getState(), fieldId)))
            dispatch(selectUnselect(selectedChip))
            return undefined
        }
        //if chips kicked out selected = kickedout
        //if selected get free fields, if free move
        //if !selected select
        if (playerHasChipsOnField(getState(), fieldId)) {
            dispatch(selectUnselect(fieldId));
            //get possible moves
        }
        dispatch(setPossibleMoves(getPossibleMoves(getState())));
        return fieldId;
        // return fieldId;
    })


export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        selectUnselect: (state, {payload}: ChipAction) => {
            console.log(payload, state.selectedChip);
            if (state.selectedChip === undefined) {
                state.selectedChip = payload;
                return
            }
            if (state.selectedChip === payload) state.selectedChip = undefined;
        },
        setPossibleMoves: (state, {payload}: MoveAction) => {
            state.possibleMoves = payload;
        },
        updateBoard: (state, {payload}: BoardAction) => {
            state.board = payload;
        }
    },
    extraReducers: builder => {

        builder
            .addCase(handleClickOnField.fulfilled, (state, {payload}: ChipAction) => {
                console.log(payload)
            })
    }
});

export const {selectUnselect, setPossibleMoves, updateBoard} = boardSlice.actions;

export const selectedChip = (state: RootState) => state.board.selectedChip;
export const selectBoard = (state: RootState) => state.board.board;
export const selectPossibleMoves = (state: RootState) => state.board.possibleMoves;
export default boardSlice.reducer;
