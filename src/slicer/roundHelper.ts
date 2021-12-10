export interface RoundState{
    activePlayer: 1 | 0,
    enemyPlayer: 1 | 0,
    round?: number,
    diceRoll: number[],
    newRound: boolean
}
