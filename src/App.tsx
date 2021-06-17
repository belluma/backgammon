import React from "react";
import "./App.css";
import Board from "./components/Board/Board";
import Dice from "./components/Dice/Dice";
import { field } from "./interfaces";

function App() {
  let board: field[] = [...Array(24)].map((a) => (a = { b: 0, w: 0 }));
  let setup = [
    { pos: 0, amount: 2 },
    { pos: 11, amount: 5 },
    { pos: 16, amount: 3 },
    { pos: 18, amount: 5 },
  ];
  for (let i = 0; i < setup.length; i++) {
    const position = setup[i].pos;
    board[position].w = setup[i].amount;
    board[board.length - 1 - position].b = setup[i].amount;
  }
  // let dieOne:number, dieTwo:number
  const rollDie = () => Math.floor(Math.random() * 6) + 1;
  const [dice, setDice] = React.useState({
    dieOne: rollDie(),
    dieTwo: rollDie(),
  });

  const rollDice = () => {
    setDice({ ...dice, dieOne: rollDie(), dieTwo: rollDie() });
    console.log(dice);
  };
  let rolledDice = [<Dice num={dice.dieOne} />, <Dice num={dice.dieTwo} />];
  return (
    <section style={{ position: "relative" }}>
      <section style={{ display: "inline-block" }}>
        <Board board={board} />
      </section>
      <section
        className={"vertical-center"}
        style={{ display: "inline-block" }}
        onClick={rollDice}
      >
        {rolledDice}
      </section>
    </section>
  );
}

export default App;
