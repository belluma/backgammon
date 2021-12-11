export interface RoundState{
    activePlayer: 1 | 0,
    enemyPlayer: 1 | 0,
    diceRoll: number[],
    newRound: boolean
}
