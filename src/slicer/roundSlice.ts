import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {PlayerNameAction, RoundState} from "./roundHelper";
import {selectUnselect, setPossibleMoves, updateBoard} from "./boardSlice";
import {getPossibleMoves} from "./moveChipsHelper";
import {PlayerAction, startBoard} from "./boardHelper";


const initialState: RoundState = {
    activePlayer: 0,
    enemyPlayer: 1,
    diceRoll: [1, 1],
    newRound: true,
    showPopper: true,
    playerNames: ['player 1', 'player 2'],
    gameStarted: false,
    gameEnd: false,
    points: [0, 0]
}

export const rollDiceAndCheckForKickedStones = createAsyncThunk<void, number[], { state: RootState, dispatch: Dispatch }>(
    "rollDice",
    (diceRoll, {getState, dispatch}) => {
        dispatch(setDiceRoll(diceRoll));
        const {kickedChips} = getState().chips;
        const {activePlayer} = getState().round;
        if (kickedChips[activePlayer]) {
            dispatch(selectUnselect(activePlayer ? 24 : -1))
            dispatch(setPossibleMoves(getPossibleMoves(getState(), true)));
        }
    }
)

const waitABit = () => {
    return new Promise<void>((r) => setTimeout(() => r(), 1000));
}
const finishRound = (winner: 1 | 0, dispatch:Dispatch) => {
    dispatch(addPoints(winner))
    dispatch(endGame())
    dispatch(updateBoard(startBoard))
}

export const swapPlayers = createAsyncThunk<void, void, { state: RootState, dispatch: Dispatch }>(
    'swapPlayers',
    async (_, {getState, dispatch}) => {
        const {chips, round} = getState();
        if (!chips.board.reduce((a, b) => a + b[round.enemyPlayer], 0)) {
            finishRound(round.enemyPlayer, dispatch)
        }
        return await waitABit();
    }
);

export const roundSlice = createSlice({
    name: 'round',
    initialState,
    reducers: {
        setDiceRoll: (state, {payload}: PayloadAction<number[]>) => {
            state.diceRoll = payload;
            state.newRound = false;
        },
        beginRound: (state) => {
            state.newRound = false
        },
        hidePopper: (state) => {
            state.showPopper = false;
        },
        savePlayerName: (state, {payload}: PlayerNameAction) => {
            state.playerNames[payload.player] = payload.name;
        },
        startGame: (state) => {
            state.gameStarted = true;
        },
        endGame: state => {
            state.gameEnd = true
        },
        addPoints: (state, {payload}: PlayerAction) => {
            state.points[payload]++;
        }
    },
    extraReducers: builder => {
        builder.addCase(swapPlayers.pending, state => {
            [state.activePlayer, state.enemyPlayer] = [state.enemyPlayer, state.activePlayer];
            state.newRound = true;
            state.showPopper = true;
        })
            .addCase(swapPlayers.fulfilled, state => {
                state.showPopper = false;
                state.gameEnd = false;
            })
    }
});

export const {setDiceRoll, beginRound, hidePopper, savePlayerName, startGame, endGame, addPoints} = roundSlice.actions;

export default roundSlice.reducer;
export const selectActivePlayer = (state: RootState) => (state.round.activePlayer);
export const selectEnemyPlayer = (state: RootState) => (state.round.enemyPlayer);
export const selectDiceRoll = (state: RootState) => (state.round.diceRoll);
export const selectNewRound = (state: RootState) => (state.round.newRound);
export const selectShowPopper = (state: RootState) => (state.round.showPopper);
export const selectPlayerNames = (state: RootState) => (state.round.playerNames);
export const selectGameStarted = (state: RootState) => (state.round.gameStarted);
export const selectGameEnded = (state: RootState) => (state.round.gameEnd);
export const selectPoints = (state: RootState) => (state.round.points);
