import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {BoardAction, BoardState, ChipAction, MoveAction, startBoard} from "./boardHelper";
import {getPossibleMoves, moveStone, playerHasChipsOnField} from "./moveChipsHelper";
import {setDiceRoll, swapPlayers} from "./roundSlice";
import {removeDiceUsed} from "./diceHelper";


const initialState: BoardState = {
    selectedChip: undefined,
    board: startBoard,
    possibleMoves: [],
    kickedChips: [0, 0]
}

export const handleClickOnField = createAsyncThunk<number | undefined, number, { state: RootState, dispatch: Dispatch }>(
    'fieldClickHandler',
    (fieldId, {getState, dispatch}) => {
        const {selectedChip} = getState().board;
        if (selectedChip !== undefined && selectedChip !== fieldId) {
            dispatch(updateBoard(moveStone(dispatch, getState(), fieldId)));
            dispatch(setDiceRoll(removeDiceUsed(getState(), fieldId)))
            dispatch(selectUnselect(selectedChip));
            if (!getState().round.diceRoll.length) dispatch(swapPlayers())
            return undefined;
        }
        if (!getState().round.diceRoll.length) {
            //add feedback to user
            return;
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
            if (state.selectedChip === undefined) {
                state.selectedChip = payload;
                return
            }
            if (state.selectedChip === payload) {
                state.selectedChip = undefined;
                state.possibleMoves = [];
            }
        },
        setPossibleMoves: (state, {payload}: MoveAction) => {
            state.possibleMoves = payload;
        },
        updateBoard: (state, {payload}: BoardAction) => {
            state.board = payload;
        },
        kickStone: (state, {payload}: PayloadAction<1 | 0>) => {
            state.kickedChips[payload]++;
        }
    },
    extraReducers: builder => {

        builder
            .addCase(handleClickOnField.fulfilled, (state, {payload}: ChipAction) => {
            })
    }
});

export const {selectUnselect, setPossibleMoves, updateBoard, kickStone} = boardSlice.actions;

export const selectedChip = (state: RootState) => state.board.selectedChip;
export const selectBoard = (state: RootState) => state.board.board;
export const selectPossibleMoves = (state: RootState) => state.board.possibleMoves;
export const selectKickedChips = (state: RootState) => state.board.kickedChips;
export default boardSlice.reducer;
