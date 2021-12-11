import {AnyAction, createAsyncThunk, createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import {RoundState} from "./roundHelper";
import {selectUnselect, setPossibleMoves} from "./boardSlice";
import {getPossibleMoves} from "./moveChipsHelper";


const initialState: RoundState = {
    activePlayer: 0,
    enemyPlayer: 1,
    diceRoll: [1, 1],
    newRound: true,
    showPopper: true,
    playerNames: ['player 1', 'player 2']
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

export const swapPlayers = createAsyncThunk<void, void, {}>(
    'swapPlayers',
    async () => {
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
        hidePopper:(state) => {
            state.showPopper = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(swapPlayers.pending, state => {
            [state.activePlayer, state.enemyPlayer] = [state.enemyPlayer, state.activePlayer];
            state.newRound = true;
            state.showPopper = true;
        })
            .addCase(swapPlayers.fulfilled, state => {
                state.showPopper = false
            })
    }
});

export const {setDiceRoll, beginRound, hidePopper} = roundSlice.actions;

export default roundSlice.reducer;
export const selectActivePlayer = (state: RootState) => (state.round.activePlayer)
export const selectEnemyPlayer = (state: RootState) => (state.round.enemyPlayer)
export const selectDiceRoll = (state: RootState) => (state.round.diceRoll)
export const selectNewRound = (state: RootState) => (state.round.newRound)
export const selectShowPopper = (state: RootState) => (state.round.showPopper)
export const selectPlayerNames = (state: RootState) => (state.round.playerNames)
