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

   return(
      <ActionsWrapper>
         <Button onClick={handleClick}>Roll Dice</Button>
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
