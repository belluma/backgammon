import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {BoardAction, BoardState, ChipAction, MoveAction, PlayerAction, startBoard} from "./boardHelper";
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
        const {selectedChip, possibleMoves} = getState().chips;
        const {activePlayer} = getState().round;
        if (selectedChip !== undefined && selectedChip !== fieldId) {
            if(possibleMoves.indexOf(fieldId) === -1) return;
            dispatch(updateBoard(moveStone(dispatch, getState(), fieldId)));
            dispatch(setDiceRoll(removeDiceUsed(getState(), fieldId)))
            dispatch(selectUnselect(selectedChip));
            if(getState().chips.kickedChips[activePlayer] > 0) {
                dispatch(selectUnselect(activePlayer ? 24 : -1));
                dispatch(setPossibleMoves(getPossibleMoves(getState())));
            }
            if (!getState().round.diceRoll.length) {
                dispatch(swapPlayers())
            }
            return undefined;
        }
        if (!getState().round.diceRoll.length) {
            //add feedback to user
            return;
        }
        if (playerHasChipsOnField(getState(), fieldId)) {
            dispatch(selectUnselect(fieldId));
        }
        dispatch(setPossibleMoves(getPossibleMoves(getState())));
        return fieldId;
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
        kickStone: (state, {payload}: PlayerAction) => {
            state.kickedChips[payload]++;
        },
        returnOnBoard: (state, {payload}:PlayerAction) => {
            state.kickedChips[payload]--;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(handleClickOnField.fulfilled, (state, {payload}: ChipAction) => {
            })
    }
});

export const {selectUnselect, setPossibleMoves, updateBoard, kickStone, returnOnBoard} = boardSlice.actions;

export const selectedChip = (state: RootState) => state.chips.selectedChip;
export const selectBoard = (state: RootState) => state.chips.board;
export const selectPossibleMoves = (state: RootState) => state.chips.possibleMoves;
export const selectKickedChips = (state: RootState) => state.chips.kickedChips;
export default boardSlice.reducer;
