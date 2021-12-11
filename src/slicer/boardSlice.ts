import {createAsyncThunk, createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {BoardAction, BoardState, ChipAction, MoveAction, PlayerAction, startBoard} from "./boardHelper";
import {
    getPossibleMoves
    , moveAndUpdateDice,
    noMovesPossible,
    playerHasChipsOnField, selectKickedOutStone, selectStone, stoneIsBlocked, unSelectStone
} from "./moveChipsHelper";
import {setDiceRoll, swapPlayers} from "./roundSlice";


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
    // @ts-ignore
    dispatch(swapPlayers());
}

export const handleClickOnField = createAsyncThunk<void, number, { state: RootState, dispatch: Dispatch }>(
    'fieldClickHandler',
    (fieldId, {getState, dispatch}) => {
        const {selectedChip, possibleMoves} = getState().chips;
        if (selectedChip !== undefined && selectedChip !== fieldId) {
            if (noMovesPossible(getState())) {
                console.log(`it's your turn player ${getState().round.enemyPlayer}`)
                endRound(dispatch);
            }
            if (possibleMoves.indexOf(fieldId) === -1) return;
            moveAndUpdateDice(getState(), dispatch, fieldId);
            selectKickedOutStone(getState(), dispatch)
            if (!getState().round.diceRoll.length || noMovesPossible(getState())) {
                endRound(dispatch);
            }
        }
        if (!getState().round.diceRoll.length) {
         console.log(`it's your turn player ${getState().round.activePlayer}`)
            return;
        }
        if (noMovesPossible(getState())) {
            console.log(`it's your turn player ${getState().round.enemyPlayer}`)
            endRound(dispatch);
        }
        if (playerHasChipsOnField(getState(), fieldId) && !stoneIsBlocked(getState(), fieldId)) {
            dispatch(selectUnselect(fieldId));
        }
        dispatch(setPossibleMoves(getPossibleMoves(getState())));
    })


export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        selectUnselect: (state, {payload}: ChipAction) => {
            if (selectStone(state, payload)) return;
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
