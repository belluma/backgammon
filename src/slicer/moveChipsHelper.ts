import {RootState} from "../app/store";
import {Dispatch} from "@reduxjs/toolkit";
import {kickStone, returnOnBoard, selectUnselect, setPossibleMoves, updateBoard} from "./boardSlice";
import {setDiceRoll} from "./roundSlice";
import {highestDieNeeded, oneDieExact, removeDiceUsed} from "./diceHelper";
import {BoardState} from "./boardHelper";


export const playerHasChipsOnField = ({chips, round}: RootState, fieldId: number | undefined) => {
    if (fieldId === undefined) return undefined
    return chips.board[fieldId][round.activePlayer] > 0;
}
const isOnBoard = (fieldId: number): boolean => fieldId >= 0 && fieldId < 24;
const allChipsInHomeQuarter = ({chips, round}: RootState): boolean => {
    const notHome =
        round.activePlayer === 0 ? chips.board.slice(0, 18) : chips.board.slice(6);
    if (chips.kickedChips[round.activePlayer] > 0) return false;
    return notHome.reduce((a, b) => a + b[round.activePlayer], 0) === 0;
};
const addJumpoutToPossibleMoves = ({chips, round}: RootState, target: number, moves: number[]) => {
    const {selectedChip} = chips;
    const {activePlayer, diceRoll} = round;
    //@ts-ignore gets called only with selectedChip
    const distanceToExit = activePlayer ? selectedChip + 1 : 24 - selectedChip
    if (!oneDieExact(diceRoll, distanceToExit) && highestDieNeeded({chips, round}) > distanceToExit) return;
    if (allChipsInHomeQuarter({chips, round}) && target < 0 && moves.indexOf(-1) === -1) {
        moves.push(-1)
    }
    if (allChipsInHomeQuarter({chips, round}) && target > 23 && moves.indexOf(24) === -1) {
        moves.push(24);
    }
}
const fieldIsFree = ({chips, round}: RootState, fieldId: number): boolean => {
    if (!isOnBoard(fieldId)) return false;
    return chips.board[fieldId][round.enemyPlayer] <= 1;
};
const getBaseMoves = ({chips, round}: RootState) => {
    const {diceRoll, activePlayer} = round;
    const {selectedChip} = chips;
    const moves: number[] = [];
    if (selectedChip === undefined) return moves;
    diceRoll.forEach(die => {
        const target = (activePlayer ? (die * -1) : die) + selectedChip;
        if (fieldIsFree({chips, round}, target) && moves.indexOf(target) < 0) moves.push(target);
        addJumpoutToPossibleMoves({chips, round}, target, moves);
    })
    return moves;
}
const getNextMoves = ({chips, round}: RootState, usedDie: number, index: number, moves: number[] = []): any => {
    const {diceRoll, activePlayer} = round;
    const {selectedChip} = chips;
    if (selectedChip === undefined) return;
    const nextStep = usedDie + diceRoll[index];
    const target = (activePlayer ? (nextStep * -1) : nextStep) + selectedChip;
    if (fieldIsFree({chips, round}, target)) {
        moves.push(target);
        const usedDiceCombined = diceRoll.slice(0, index + 1).reduce((a, b) => a + b, 0)
        if (index < diceRoll.length - 1) return getNextMoves({chips, round}, usedDiceCombined, index + 1, moves)
    }
    return moves
}
export const getPossibleMoves = ({chips, round}: RootState, kickedOut = false) => {
    const moves: number[] = getBaseMoves({chips, round});
    const dice = [...round.diceRoll];
    if (kickedOut) return moves;
    if (moves.length) {
        return [...moves, ...getNextMoves({chips, round}, dice[0], 1)];
    }
    return moves;
}
const hasChipsKickedOut = ({chips, round}: RootState) => chips.kickedChips[round.activePlayer] > 0;
export const noMovesPossible = ({chips, round}: RootState) => {
    const {activePlayer} = round;
    const {board} = chips;
    if (hasChipsKickedOut({chips, round})) {
        return !getPossibleMoves({chips: {...chips, selectedChip: activePlayer ? 24 : -1}, round}).length
    }
    return (board.map((field, i) => {
        if (field[activePlayer] > 0) {
            return getPossibleMoves({chips: {...chips, selectedChip: i}, round})
        } else return []
    }).every(possibleMoves => !possibleMoves.length));
}
const removeChipFromField = (dispatch: Dispatch, fieldIndex: number, player: 1 | 0, currentBoard: number[][]): void => {
    if (fieldIndex === -1 || fieldIndex === 24) {
        dispatch(returnOnBoard(player));
        return
    }
    currentBoard[fieldIndex][player]--;
};
const addChipToField = (fieldIndex: number, player: 1 | 0, currentBoard: number[][]): void => {
    currentBoard[fieldIndex][player]++;
};
const kickEnemyStone = (dispatch: Dispatch, {
    chips,
    round
}: RootState, fieldId: number, currentBoard: number[][]): void => {
    removeChipFromField(dispatch, fieldId, round.enemyPlayer, currentBoard);
    dispatch(kickStone(round.enemyPlayer));
}
const needToKickEnemy = ({chips, round}: RootState, fieldId: number): boolean => {
    return chips.board[fieldId][round.enemyPlayer] === 1;
}

const moveStone = (dispatch: Dispatch, {chips, round}: RootState, fieldId: number): number[][] => {
    const currentBoard = [...chips.board.map(field => [...field])];
    if (chips.possibleMoves.indexOf(fieldId) >= 0) {
        //@ts-ignore gets executed only after check for selectedChip
        removeChipFromField(dispatch, chips.selectedChip, round.activePlayer, currentBoard)
        if (fieldId < 0 || fieldId > 23) return currentBoard
        addChipToField(fieldId, round.activePlayer, currentBoard);
        if (needToKickEnemy({chips, round}, fieldId)) kickEnemyStone(dispatch, {chips, round}, fieldId, currentBoard);
    }
    return currentBoard;
}

export const stoneIsBlocked = ({chips, round}: RootState, fieldId: number) => {
    return !getPossibleMoves({
        chips: {...chips, selectedChip: fieldId},
        round
    }).map(move => Math.abs(fieldId - move)).length;
}
export const selectStone = (state: BoardState, payload: number | undefined) => {
    if (state.selectedChip === undefined) {
        state.selectedChip = payload;
        return true
    }
    return false
}
export const unSelectStone = (state: BoardState, payload: number | undefined) => {
    if (state.selectedChip === payload) {
        state.selectedChip = undefined;
        state.possibleMoves = [];
    }
}
export const selectKickedOutStone = ({chips,round}: RootState, dispatch: Dispatch) => {
    if (hasChipsKickedOut({chips, round})) {
        const kicked = round.activePlayer ? 24 : -1
        dispatch(selectUnselect(kicked));
        dispatch(setPossibleMoves(getPossibleMoves({chips:{...chips, selectedChip:kicked}, round})));
    }
}
export const moveAndUpdateDice = (state: RootState, dispatch: Dispatch, fieldId: number) => {
    dispatch(updateBoard(moveStone(dispatch, state, fieldId)));
    dispatch(setDiceRoll(removeDiceUsed(state, fieldId)))
    dispatch(selectUnselect(state.chips.selectedChip));
}
