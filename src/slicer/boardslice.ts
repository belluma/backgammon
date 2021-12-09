import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../app/store';

interface State {
    selectedChip: number | undefined
}

const initialState: State = {
    selectedChip: undefined
}


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


    }
});

export const {selectField} = boardSlice.actions;

export const selectedChip = (state: RootState) => state.board.selectedChip;
export default boardSlice.reducer;
