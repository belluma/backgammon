import React from 'react';
import styles from './Chip.module.css';

type Props = {
  className?: string
}

const Chip: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (props) => (
  <button className={props.className} data-testid="Chip">
    
  </button>
);

export default Chip;
