import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {RoundState} from "./roundHelper";


const initialState:RoundState = {
    activePlayer: 0,
    enemyPlayer: 1,
    round: 0,
    diceRoll: [1, 1],
    newRound: true
}


export const roundSlice = createSlice({
    name: 'round',
    initialState,
    reducers: {
        setDiceRoll: (state, {payload}: PayloadAction<number[]>) => {
            state.diceRoll = payload;
            state.newRound = false;
        },
        swapPlayers: (state) => {
            [state.activePlayer, state.enemyPlayer] = [state.enemyPlayer, state.activePlayer];
            state.newRound = true;
        },
        beginRound: (state) => {
            state.newRound = false
        }
    },
});

export const {setDiceRoll, swapPlayers, beginRound} = roundSlice.actions;

export default roundSlice.reducer;
export const selectActivePlayer = (state: RootState) => (state.round.activePlayer)
export const selectEnemyPlayer = (state: RootState) => (state.round.enemyPlayer)
export const selectRound = (state: RootState) => (state.round.round)
export const selectDiceRoll = (state: RootState) => (state.round.diceRoll)
export const selectNewRound = (state: RootState) => (state.round.newRound)
