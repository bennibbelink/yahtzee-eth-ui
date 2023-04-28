import React, { FC, useEffect, useState } from 'react';
import { DiceWrapper, DieWrapper, RollingDieWrapper } from './Dice.styled';
import { State } from '../../Types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDiceOne, faDiceTwo, faDiceThree, 
   faDiceFour, faDiceFive, faDiceSix} from '@fortawesome/free-solid-svg-icons'
import Yahtzee from '../../Services/API';


interface DiceProps {
   yahtzee: Yahtzee
   // selected: boolean[]
   // setSelected: React.Dispatch<React.SetStateAction<boolean[]>>
   rolling: boolean
}

const Dice: FC<DiceProps> = (props: DiceProps) => {
   
   return (
      <DiceWrapper>
         { props.yahtzee.gameState.dice.map((d, i) => (
            <div key={i} onClick={() => onclick(i)}>        
               {
                  props.yahtzee.gameState.selected[i] && props.rolling ? 
                  <RollingDieWrapper>
                  <FontAwesomeIcon icon={
                        d == 1 ? faDiceOne : 
                        d == 2 ? faDiceTwo : 
                        d == 3 ? faDiceThree :
                        d == 4 ? faDiceFour :
                        d == 5 ? faDiceFive : 
                        d == 6 ? faDiceSix : 
                        faDiceOne
                     } size={'3x'} style={props.yahtzee.gameState.selected[i] ? {} : {'color': 'gray'}}></FontAwesomeIcon>
                  </RollingDieWrapper>
                  :
                  <DieWrapper>
                     <FontAwesomeIcon icon={
                           d == 1 ? faDiceOne : 
                           d == 2 ? faDiceTwo : 
                           d == 3 ? faDiceThree :
                           d == 4 ? faDiceFour :
                           d == 5 ? faDiceFive : 
                           d == 6 ? faDiceSix : 
                           faDiceOne
                        } size={'3x'} style={props.yahtzee.gameState.selected[i] ? {} : {'color': 'gray'}}></FontAwesomeIcon>
                  </DieWrapper>
               }       
               
            </div>
            ))
         }
      </DiceWrapper>
   );

   function onclick(ind: number) {
      if (props.yahtzee.gameState.turn == props.yahtzee.currentAccount) {
         props.yahtzee.toggleSelectDie(ind);
      }
   }
}



export default Dice;
