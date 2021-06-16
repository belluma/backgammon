import React from 'react';
import styles from './Field.module.css';
import Chip from '../Chip/Chip'


type Props = {
  className?: string
}

const Field: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (props) => (
  
  <button className={styles.Field} data-testid="Field">
   <div className={props.className} ></div>
   <Chip className='chip-white'/>
   <Chip className='chip-white'/>

   </button>
);

export default Field;
