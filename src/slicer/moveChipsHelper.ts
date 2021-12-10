import {RootState} from "../app/store";


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
    return fieldId === -1 || fieldId === 24
        ? true
        : board.board[fieldId][round.enemyPlayer] <= 1;
};

export const getPossibleMoves = ({board, round}: RootState) => {

    const moves: number[] = [];
    const dice = [...round.diceRoll];
    if (board.selectedChip === undefined) return moves;
    dice.forEach(die => {
        //@ts-ignore function returns when selected chip undefined
        const target = (round.activePlayer ? (die * -1) : die) + board.selectedChip
        //@ts-ignore function returns when selected chip undefined
        if (fieldIsFree({board, round}, target)) moves.push(board.selectedChip + die)
    })
    const getNextMoves = (usedDie: number, index: number) => {
        const nextStep = usedDie + dice[index];
        //@ts-ignore function returns when selected chip undefined
        const target = (round.activePlayer ? (nextStep * -1) : nextStep + board.selectedChip);
        //@ts-ignore function returns when selected chip undefined
        if (fieldIsFree({board, round}, target)) {
            moves.push(target)
            if (index < dice.length - 1) getNextMoves(target, index + 1)
        }
    }
    if (moves.length) getNextMoves(dice[0], 1)
    return moves;
}
