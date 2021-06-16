import React from 'react';
import styles from './Board.module.css';
import Quarter from '../Quarter/Quarter'


type Props = {
  className?: string
}

const Board  = (props:any) => {

return<section>
   <section><Quarter top={true} /><Quarter top={true} /></section>
   <section><Quarter top={false} /><Quarter top={false} /></section>
   </section>
}
  
  


export default Board;
