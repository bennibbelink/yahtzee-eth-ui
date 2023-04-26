import React, { FC, useState } from 'react';
import { DiceWrapper, DieWrapper } from './Dice.styled';
import { State } from '../../Types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDiceOne, faDiceTwo, faDiceThree, 
   faDiceFour, faDiceFive, faDiceSix} from '@fortawesome/free-solid-svg-icons'
import Yahtzee from '../../Services/API';


interface DiceProps {
   yahtzee: Yahtzee
   selected: boolean[]
   setSelected: React.Dispatch<React.SetStateAction<boolean[]>>
}

const Dice: FC<DiceProps> = (props: DiceProps) => {
   
   return (
      <DiceWrapper>
         { props.yahtzee.gameState.dice.map((d, i) => (
            <div key={i} onClick={() => onclick(i)}>               
               <DieWrapper>
                  <FontAwesomeIcon icon={
                        d == 1 ? faDiceOne : 
                        d == 2 ? faDiceTwo : 
                        d == 3 ? faDiceThree :
                        d == 4 ? faDiceFour :
                        d == 5 ? faDiceFive : 
                        d == 6 ? faDiceSix : 
                        faDiceOne
                     } size={'2xl'} style={props.selected[i] ? {} : {'border': 'solid gray 2px'}}></FontAwesomeIcon>
               </DieWrapper>
            </div>
            ))
         }
      </DiceWrapper>
   );

   function onclick(ind: number) {
      let copy: boolean[] = []
      for (let i = 0; i < props.selected.length; i++) {
         copy.push(props.selected[i]);
      }
      copy[ind] = !copy[ind]
      props.setSelected(copy)
   }
}



export default Dice;
