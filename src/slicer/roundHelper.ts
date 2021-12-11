import {PayloadAction} from "@reduxjs/toolkit";

export interface RoundState{
    activePlayer: 1 | 0,
    enemyPlayer: 1 | 0,
    diceRoll: number[],
    newRound: boolean,
    showPopper:boolean,
    playerNames: string[],
    gameStarted: boolean,
}

type PlayerName = {player: number, name: string}
export type PlayerNameAction = PayloadAction<PlayerName>
