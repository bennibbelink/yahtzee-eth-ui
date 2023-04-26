import React, { FC, useState } from 'react';
import { ActionsWrapper } from './Actions.styled';
import { Button } from './Actions.styled'
import Yahtzee from '../../Services/API';

interface ActionsProps {
   yahtzee: Yahtzee
   selected: boolean[]
}

const Actions: FC<ActionsProps> = (props: ActionsProps) => {

   const [message, setMessage] = useState<string>("")

   function disableButton(): boolean {
      if (props.yahtzee.gameState.turn !== props.yahtzee.currentAccount) return true
      if (props.yahtzee.gameState.rollsLeft == 0) return true
      return false   
   }

   return(
      <ActionsWrapper>
         <Button onClick={handleClick} disabled={disableButton()}>Roll Dice</Button>
         <p>Rolls left: {props.yahtzee.gameState.rollsLeft}</p>
         <p style={{'height': '100px'}}> {message? message.toString() : ""}</p>
      </ActionsWrapper>
   );

   async function handleClick() {
      props.yahtzee.rollDice(props.selected)
         .then()
         .catch((err: string) => {
            setMessage(err)
            setTimeout(() => {
               setMessage(" ")
            }, 3000)
         });
   }

}
 


export default Actions;
