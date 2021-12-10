import {RootState} from "../app/store";
import {Dispatch} from "@reduxjs/toolkit";
import {kickStone, returnOnBoard} from "./boardSlice";


export const playerHasChipsOnField = ({round, board}: RootState, fieldId: number | undefined) => {
    if (fieldId === undefined) return undefined
    return board.board[fieldId][round.activePlayer] > 0;
}
const isOnBoard = (fieldId: number): boolean => fieldId >= 0 && fieldId < 24;

const allChipsInHomeQuarter = ({board, round}: RootState): boolean => {
    const notHome =
        round.activePlayer === 0 ? board.board.slice(0, 18) : board.board.slice(6);
    if (board.kickedChips[round.activePlayer] > 0) return false;
    return notHome.reduce((a, b) => a + b[round.activePlayer], 0) === 0;
};

const fieldIsFree = ({board, round}: RootState, fieldId: number): boolean => {
    if (!isOnBoard(fieldId) && !allChipsInHomeQuarter({board, round})) return false;
    return board.board[fieldId][round.enemyPlayer] <= 1;
};
const getBaseMoves = ({board, round}:RootState) => {
    const {diceRoll, activePlayer} = round;
    const {selectedChip} = board;
    const moves: number[] = [];
    if(selectedChip === undefined) return moves;
    diceRoll.forEach(die => {
        const target = (round.activePlayer ? (die * -1) : die) + selectedChip;
        if(fieldIsFree({board, round}, target) && moves.indexOf(target) < 0) moves.push(target);
    })
    return moves;
}
const getNextMoves = ({board, round}:RootState, usedDie: number, index: number, moves :number[]= []):any => {
    const {diceRoll, activePlayer} = round;
    const {selectedChip} = board;
    if(selectedChip === undefined) return;
    const nextStep = usedDie + diceRoll[index];
    const target = (activePlayer ? (nextStep * -1) : nextStep) + selectedChip;
    if(fieldIsFree({board, round}, target)){
        moves.push(target);
        const usedDiceCombined = diceRoll.slice(0, index + 1).reduce((a, b) => a + b, 0)
        if(index < diceRoll.length - 1)return  getNextMoves({board, round}, usedDiceCombined, index + 1, moves)
    }
    return moves
}

export const getPossibleMoves = ({board, round}: RootState, kickedOut = false) => {
    const moves: number[] = getBaseMoves({board,round});
    const dice = [...round.diceRoll];
    if(kickedOut) return moves;
    if (moves.length) {
        return [...moves, ...getNextMoves({board, round}, dice[0], 1)];
    }
    return moves;
}

const removeChipFromField = (dispatch:Dispatch, fieldIndex: number, player: 1 | 0, currentBoard: number[][]): void => {
    if(fieldIndex === -1 || fieldIndex === 24) {
        dispatch(returnOnBoard(player));
        return
    }
    currentBoard[fieldIndex][player]--;
};
const addChipToField = (fieldIndex: number, player: 1 | 0, currentBoard: number[][]): void => {
    currentBoard[fieldIndex][player]++;
};
const kickEnemyStone = (dispatch:Dispatch, {board, round}:RootState, fieldId:number, currentBoard: number[][]): void => {
    removeChipFromField(dispatch, fieldId, round.enemyPlayer, currentBoard);
    dispatch(kickStone(round.enemyPlayer));
}
const needToKickEnemy = ({board, round}:RootState, fieldId:number):boolean => {
    return board.board[fieldId][round.enemyPlayer] === 1;
}

export const moveStone = (dispatch: Dispatch, {board, round}: RootState, fieldId: number): number[][] => {
    const currentBoard = [...board.board.map(field => [...field])];
    if (board.possibleMoves.indexOf(fieldId) >= 0) {
        //@ts-ignore gets executed only after check for selectedChip
        removeChipFromField(dispatch, board.selectedChip, round.activePlayer, currentBoard)
        addChipToField(fieldId, round.activePlayer, currentBoard);
        if(needToKickEnemy({board, round}, fieldId)) kickEnemyStone(dispatch, {board, round}, fieldId, currentBoard);
    }
    return currentBoard;
}
