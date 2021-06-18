import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import Board from "./components/Board/Board";
import Dice from "./components/Dice/Dice";
let board: number[][] = [...Array(24)].map((a) => (a = [0, 0]));
const chips = [
  { pos: 0, amount: 2 },
  { pos: 11, amount: 5 },
  { pos: 16, amount: 3 },
  { pos: 18, amount: 5 },
];
chips.map((a) => {
  console.log(123);
  board[a.pos][0] = a.amount;
  board[board.length - 1 - a.pos][1] = a.amount;
});

function App() {
  const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1;
  };
  const [turn, setTurn] = useState({
    activePlayer: 0,
    round: 0,
  });
  const [dice, setDice] = useState({
    dieOne: 1,
    dieTwo: 1,
  });
  const [selectedChip, setSelectedChip] = useState({ selected: false, id: 0 });
  const rollDice = () => {
    setDice({ ...dice, dieOne: rollDie(), dieTwo: rollDie() });
  };

  //initial setup of the board

  const [game, setGame] = useState({ board: board });
  //before gamestart
  const rollDiceToDetermineStartingPlayer = () => {
    if (turn.round === 0) {
      if (dice.dieOne === dice.dieTwo) rollDice();
      else
        setTurn({
          ...turn,
          activePlayer: dice.dieOne > dice.dieTwo ? 0 : 1,
          round: turn.round + 1,
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
    return board[field][turn.activePlayer * -1 + 1] <= 1;
  };
  const getTargetPosition = (startField: number, diceRoll: number): number => {
    return turn.activePlayer === 0
      ? startField + diceRoll
      : startField - diceRoll;
  };
  const isOnBoard = (field: number): boolean => field >= 0 && field < 24;

  const hasChipsOnField = (field: number, player: number): boolean =>
    game.board[field][player] > 0;

  const removeChipFromField = (field: number, player: number): void => {
    board[field][player]--;
  };
  const addChipToField = (field: number, player: number): void => {
    board[field][player]++;
  };
  const takeEnemyStone = (field: number): void => {
    board[field][turn.activePlayer * -1 + 1]--;
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
    if (diceRoll.length === 4) {
      const target = getTargetPosition(selectedField, diceRoll[index]);
      if (isOnBoard(target)) {
        if (fieldIsFree(target)) {
          f.push(target);
          return getPossibleMoves(diceRoll, f, index + 1, target);
        }
      }
    } else {
      let target = getTargetPosition(selectedField, diceRoll[0]);
      if (isOnBoard(target) && fieldIsFree(target)) f.push(target);
      target = getTargetPosition(selectedField, diceRoll[1]);
      if (isOnBoard(target) && fieldIsFree(target)) f.push(target);
      target = getTargetPosition(selectedField, diceRoll[0] + diceRoll[1]);
      if (f.length && isOnBoard(target) && fieldIsFree(target)) f.push(target);
    }
    return f;
  };
  //one round
  // let selectedChip: number | undefined = undefined;
  let diceRoll = saveDicerollInArrayToKeepTrackOfMovements();
  const selectField = (fieldId: number) => {
    console.log(selectedChip, diceRoll);
    if (
      !selectedChip.selected &&
      hasChipsOnField(fieldId, turn.activePlayer) &&
      getPossibleMoves(diceRoll, [], 0, fieldId).length > 0
    ) {
      console.log(123123);
      setSelectedChip({ ...selectedChip, selected: true, id: fieldId });
    }
    if (
      selectedChip.selected &&
      getPossibleMoves(diceRoll).indexOf(fieldId) > -1
    ) {
      if (hasChipsOnField(fieldId, turn.activePlayer * -1 + 1))
        takeEnemyStone(fieldId);
      removeChipFromField(selectedChip.id, turn.activePlayer);
      addChipToField(fieldId, turn.activePlayer);
      setSelectedChip({ ...selectedChip, selected: false });
      setGame({ ...game, board: board });
      console.log(getPossibleMoves(diceRoll));
      // else {
      //   console.log(selectedChip, fieldId);
      //   board[selectedChip][turn.activePlayer]--;
      //   board[fieldId][turn.activePlayer]++;
      //   selectedChip = undefined;
      //   setSelectedField(0);
      //   setGame({ ...game, board: board });
      //   // console.l;
      // }
      // console.log(diceRoll);
      // console.log(getPossibleMoves(diceRoll));
    }
  };

  useEffect(() => {
    rollDiceToDetermineStartingPlayer();
  }, [dice]);

  if (turn.round === 1)
    console.log(`'Player ${turn.activePlayer}  starts the game`);

  let rolledDice = [
    <Dice num={dice.dieOne} key={0} />,
    <Dice num={dice.dieTwo} key={1} />,
  ];
  return (
    <section>
      <h1>It's your turn Player {turn.activePlayer}</h1>
      <section className={"board"}>
        <section style={{ display: "inline-block" }}>
          <Board
            board={game.board}
            selectField={selectField}
            selectedField={selectedChip}
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
