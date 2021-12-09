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
        selectChip: (state, {payload}: PayloadAction<number>) => {
            state.selectedChip = payload
        }


    }
});

export const {selectChip} = boardSlice.actions;

export default boardSlice.reducer;
