import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import boardReducer from '../slicer/boardSlice'
import roundReducer from '../slicer/roundSlice'


export const store = configureStore({
    reducer: {
        board: boardReducer,
        round: roundReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
