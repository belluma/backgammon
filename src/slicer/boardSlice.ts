import {createAsyncThunk, createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {BoardAction, BoardState, ChipAction, MoveAction, PlayerAction, startBoard} from "./boardHelper";
import {
    getPossibleMoves,
    hasChipsKickedOut, moveAndUpdateDice,
    moveStone,
    noMovesPossible,
    playerHasChipsOnField, selectKickedOutStone
} from "./moveChipsHelper";
import {setDiceRoll, swapPlayers} from "./roundSlice";
import {removeDiceUsed} from "./diceHelper";


const initialState: BoardState = {
    selectedChip: undefined,
    board: startBoard,
    possibleMoves: [],
    kickedChips: [0, 0]
}
const endRound = (dispatch: Dispatch) => {
    dispatch(unselectChip());
    dispatch(setPossibleMoves([]));
    dispatch(setDiceRoll([]));
    dispatch(swapPlayers());
}


export const handleClickOnField = createAsyncThunk<void, number, { state: RootState, dispatch: Dispatch }>(
    'fieldClickHandler',
    (fieldId, {getState, dispatch}) => {
        const {selectedChip, possibleMoves} = getState().chips;
        if (selectedChip !== undefined && selectedChip !== fieldId) {
            if (noMovesPossible(getState())) endRound(dispatch);
            if (possibleMoves.indexOf(fieldId) === -1) return;
            moveAndUpdateDice(getState(), dispatch, fieldId);
            selectKickedOutStone(getState(), dispatch)
            if (!getState().round.diceRoll.length || noMovesPossible(getState())) {
                endRound(dispatch);
            }
        }
        if (!getState().round.diceRoll.length) {
            //add feedback to user
            return;
        }
        if (noMovesPossible(getState())) endRound(dispatch);
        if (playerHasChipsOnField(getState(), fieldId)) {
            dispatch(selectUnselect(fieldId));
        }
        dispatch(setPossibleMoves(getPossibleMoves(getState())));
    })


const selectStone = (state:BoardState, payload: number | undefined) => {
    if (state.selectedChip === undefined) {
        state.selectedChip = payload;
        return true
    }
}
const unSelectStone = (state:BoardState, payload: number | undefined) => {
    if (state.selectedChip === payload) {
        state.selectedChip = undefined;
        state.possibleMoves = [];
    }
}

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        selectUnselect: (state, {payload}: ChipAction) => {
           if(selectStone(state, payload)) return;
           unSelectStone(state, payload)
        },
        unselectChip: (state) => {
            state.selectedChip = undefined;
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
        returnOnBoard: (state, {payload}: PlayerAction) => {
            state.kickedChips[payload]--;
        }
    },
    // extraReducers: builder => {
    //     builder
    //         .addCase(handleClickOnField.fulfilled, (state, {payload}: ChipAction) => {
    //         })
    // }
});

export const {
    selectUnselect,
    unselectChip,
    setPossibleMoves,
    updateBoard,
    kickStone,
    returnOnBoard
} = boardSlice.actions;

export const selectedChip = (state: RootState) => state.chips.selectedChip;
export const selectBoard = (state: RootState) => state.chips.board;
export const selectPossibleMoves = (state: RootState) => state.chips.possibleMoves;
export const selectKickedChips = (state: RootState) => state.chips.kickedChips;
export default boardSlice.reducer;
