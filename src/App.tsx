import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import Board from "./components/Board/Board";
import Dice from "./components/Dice/Dice";

//initial setup of the board
let board: number[][] = [...Array(24)].map((a) => (a = [0, 0]));
let kickedChips = [0, 0];
const chips = [
  { pos: 0, amount: 2 },
  { pos: 11, amount: 5 },
  { pos: 16, amount: 3 },
  { pos: 18, amount: 5 },
];
chips.map((a) => {
  board[a.pos][0] = a.amount;
  board[board.length - 1 - a.pos][1] = a.amount;
});

function App() {
  const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1;
  };
  const [game, setGame] = useState({
    activePlayer: 0,
    enemyPlayer: 1,
    round: 0,
    diceRoll: [0],
    diceLeft: [0],
  });
  const [dice, setDice] = useState({
    dieOne: 1,
    dieTwo: 1,
  });
  const [selectedChip, setSelectedChip] = useState({ selected: false, id: 0 });
  const rollDice = () => {
    setDice({ ...dice, dieOne: rollDie(), dieTwo: rollDie() });
  };

  //before gamestart
  const rollDiceToDetermineStartingPlayer = () => {
    if (game.round === 0) {
      if (dice.dieOne === dice.dieTwo) rollDice();
      else
        setGame({
          ...game,
          activePlayer: dice.dieOne > dice.dieTwo ? 0 : 1,
          enemyPlayer: dice.dieOne > dice.dieTwo ? 1 : 0,
          round: game.round + 1,
          diceLeft: saveDicerollInArrayToKeepTrackOfMovements(),
          diceRoll: saveDicerollInArrayToKeepTrackOfMovements(),
        });
    }
  };

  //each round
  const saveDicerollInArrayToKeepTrackOfMovements = () => {
    return dice.dieOne === dice.dieTwo
      ? [...Array(4)].map((a) => (a = dice.dieOne))
      : [dice.dieOne, dice.dieTwo];
  };
  const fieldIsFree = (field: number): boolean => {
    return board[field][game.enemyPlayer] <= 1;
  };
  const getTargetPosition = (startField: number, diceRoll: number): number => {
    return game.activePlayer === 0
      ? startField + diceRoll
      : startField - diceRoll;
  };
  const isOnBoard = (field: number): boolean => field >= 0 && field < 24;

  const hasChipsOnField = (field: number, player: number): boolean =>
    board[field][player] > 0;

  const hasChipsKickedOut = (): boolean => kickedChips[game.activePlayer] > 0;

  const removeChipFromField = (field: number, player: number): void => {
    board[field][player]--;
  };
  const addChipToField = (field: number, player: number): void => {
    board[field][player]++;
  };
  const returnOnBoard = (): void => {
    kickedChips[game.activePlayer]--;
  };

  const takeEnemyStone = (field: number): void => {
    board[field][game.enemyPlayer]--;
    kickedChips[game.enemyPlayer]++;
  };
  const allChipsInHomeQuarter = (): boolean => {
    const notHome =
      game.activePlayer === 0 ? board.slice(0, 18) : board.slice(6);
    return notHome.reduce((a, b) => a + b[game.activePlayer], 0) === 0;
  };
  const getMovesForNonDoubleRoll = (
    selectedField: number,
    diceRoll: number[]
  ): number[] => {
    const freeFields = [];
    let target = getTargetPosition(selectedField, diceRoll[0]);
    if (isOnBoard(target) && fieldIsFree(target)) freeFields.push(target);
    target = getTargetPosition(selectedField, diceRoll[1]);
    if (isOnBoard(target) && fieldIsFree(target)) freeFields.push(target);
    target = getTargetPosition(selectedField, diceRoll[0] + diceRoll[1]);
    if (freeFields.length && isOnBoard(target) && fieldIsFree(target))
      freeFields.push(target);
    return freeFields;
  };
  const getMovesWhenChipsOut = (diceRoll: number[]): number[] => {
    const freeFields: number[] = [];
    game.activePlayer === 0
      ? diceRoll.forEach((a) => {
          if (fieldIsFree(a - 1)) freeFields.push(a - 1);
        })
      : diceRoll.forEach((a) => {
          if (fieldIsFree(24 - a)) freeFields.push(24 - a);
        });
    return freeFields;
  };
  const getPossibleMoves = (
    diceRoll: number[],
    freeFields: number[] = [],
    index: number = 0,
    selectedField: number | undefined = selectedChip.id
  ): number[] => {
    if (selectedField === undefined) return [];
    if (index === diceRoll.length) return freeFields;
    let f = freeFields;
    if (hasChipsKickedOut()) {
      return getMovesWhenChipsOut(diceRoll);
    }
    if (diceRoll.length === 4) {
      const target = getTargetPosition(selectedField, diceRoll[index]);
      if (isOnBoard(target)) {
        if (fieldIsFree(target)) {
          f.push(target);
          return getPossibleMoves(diceRoll, f, index + 1, target);
        }
      }
    } else {
      return getMovesForNonDoubleRoll(selectedField, diceRoll);
    }
    return f;
  };
  const noMovesPossible = () => {
    for (let i = 0; i < board.length; i++) {
      if (getPossibleMoves(game.diceLeft, [], 0, i).length > 0) return false;
    }
    return true;
  };
  const diceNotUsedYet = (diceRoll: number[], steps: number): number[] => {
    let start, end;
    if (diceRoll.indexOf(steps) === -1) {
      start = 0;
      if (diceRoll.length === 2) {
        end = 0;
      } else {
        end = diceRoll.length - steps / diceRoll[0];
        console.log(end);
        console.log(game.diceLeft.slice(start, end));
      }
    } else {
      start = diceRoll.indexOf(steps) === 0 ? 1 : 0;
      end = start === 0 ? 1 : 4;
    }
    return game.diceLeft.slice(start, end);
  };

  const selectChipWhenNoneSelected = (fieldId: number): void => {
    if (noMovesPossible()) endRound();
    if (
      !hasChipsKickedOut() &&
      !selectedChip.selected &&
      hasChipsOnField(fieldId, game.activePlayer) &&
      getPossibleMoves(game.diceLeft, [], 0, fieldId).length > 0
    ) {
      setSelectedChip({ ...selectedChip, selected: true, id: fieldId });
    }
  };
  const unselectChip = (fieldId: number): void => {
    if (selectedChip.id === fieldId && selectedChip.selected)
      setSelectedChip({ ...selectedChip, selected: false });
  };
  const endRound = (): void => {
    rollDice();
    setGame({
      ...game,
      activePlayer: game.enemyPlayer,
      enemyPlayer: game.activePlayer,
      round: game.round + 1,
    });
  };

  const selectField = (fieldId: number) => {
    let kicked;

    selectChipWhenNoneSelected(fieldId);
    unselectChip(fieldId);
    if (
      (selectedChip.selected || hasChipsKickedOut()) &&
      getPossibleMoves(game.diceLeft).indexOf(fieldId) > -1
    ) {
      if (hasChipsKickedOut()) {
        console.log(getPossibleMoves(game.diceLeft));
        kicked = true;
        returnOnBoard();
      } else {
        removeChipFromField(selectedChip.id, game.activePlayer);
      }
      if (hasChipsOnField(fieldId, game.enemyPlayer)) takeEnemyStone(fieldId);
      addChipToField(fieldId, game.activePlayer);
      setSelectedChip({ ...selectedChip, selected: false });
      const usedDie = !kicked
        ? Math.abs(fieldId - selectedChip.id)
        : game.activePlayer === 0
        ? fieldId + 1
        : 24 - fieldId;
      console.log(usedDie);
      const unusedDice = diceNotUsedYet(game.diceLeft, usedDie);
      setGame({
        ...game,
        diceLeft: unusedDice,
      });
      if (unusedDice.length === 0) {
        endRound();
      }
    }
  };

  useEffect(() => {
    rollDiceToDetermineStartingPlayer();
    const diceRoll = saveDicerollInArrayToKeepTrackOfMovements();
    setGame({ ...game, diceLeft: diceRoll, diceRoll: diceRoll });
  }, [dice]);

  if (game.round === 1)
    console.log(`'Player ${game.activePlayer}  starts the game`);

  let rolledDice = [
    <Dice num={dice.dieOne} key={0} />,
    <Dice num={dice.dieTwo} key={1} />,
  ];
  return (
    <section>
      <h1>It's your game Player {game.activePlayer}</h1>
      <section className={"board"}>
        <section style={{ display: "inline-block" }}>
          <Board
            board={board}
            selectField={selectField}
            selectedField={selectedChip}
            kickedChips={kickedChips}
          />
        </section>
        <section className="side">
          <section className="vertical-align" onClick={rollDice}>
            {rolledDice}
          </section>
        </section>
      </section>
    </section>
  );
}

export default App;
