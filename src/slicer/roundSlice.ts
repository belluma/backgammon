import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';


const initialState = {
    activePlayer: 0,
    enemyPlayer: 1,
    round: 0,
    diceRoll: [1, 1],
    newRound: false
}


export const roundSlice = createSlice({
    name: 'round',
    initialState,
    reducers: {
        rollDice: (state, {payload}: PayloadAction<number[]>) => {
            state.diceRoll = payload;
        },
        swapPlayers: (state) => {
            [state.activePlayer, state.enemyPlayer] = [state.enemyPlayer, state.activePlayer];
        }
    },
});

export const {rollDice, swapPlayers} = roundSlice.actions;

export default roundSlice.reducer;
export const selectActivePlayer = (state: RootState) => (state.round.activePlayer)
export const selectEnemyPlayer = (state: RootState) => (state.round.enemyPlayer)
export const selectRound = (state: RootState) => (state.round.round)
export const selectDiceRoll = (state: RootState) => (state.round.diceRoll)
export const selectNewRound = (state: RootState) => (state.round.newRound)
