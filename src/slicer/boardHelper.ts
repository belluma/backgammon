import {PayloadAction} from "@reduxjs/toolkit";

export interface BoardState {
    selectedChip: number | undefined,
    board: number[][],
    possibleMoves: number[],
    kickedChips: number[],
}

export type ChipAction = PayloadAction<number | undefined>

const emptyBoard: number[][] = [...Array(24)].map((a) => [0, 0]);

const chips = [
    {pos: 0, amount: 2},
    {pos: 11, amount: 5},
    {pos: 16, amount: 3},
    {pos: 18, amount: 5},
];

export const startBoard = emptyBoard.map((field, i) => {
    const newField = [0, 0]
    chips.forEach((a) => {
        if (i === a.pos) newField[0] = a.amount;
        else if (23 - i === a.pos) newField[1] = a.amount;
    });
    return newField;
});
