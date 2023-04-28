import React, { FC, useRef, useState } from 'react';
import { ActionsWrapper } from './Actions.styled';
import { Button } from './Actions.styled'
import Yahtzee from '../../Services/API';
import { Overlay, Popover } from 'react-bootstrap';

interface ActionsProps {
   yahtzee: Yahtzee
}

const Actions: FC<ActionsProps> = (props: ActionsProps) => {

   const [message, setMessage] = useState<string>("")
   const target = useRef(null);

   function disableButton(): boolean {
      if (props.yahtzee.gameState.turn !== props.yahtzee.currentAccount) return true
      if (props.yahtzee.gameState.rollsLeft == 0) return true
      return false   
   }

   const popover = (
      <Popover id="popover-basic">
        <Popover.Header as="h3">Popover right</Popover.Header>
        <Popover.Body>
          And here's some <strong>amazing</strong> content. It's very engaging.
          right?
        </Popover.Body>
      </Popover>
    );


   return(
      <ActionsWrapper>
         <Button onClick={handleClick} disabled={disableButton()} style={disableButton() ? {  backgroundColor: 'gray' } : {}}>Roll Dice</Button>
         <p>{
            props.yahtzee.gameState.turn == props.yahtzee.currentAccount && props.yahtzee.gameState.rollsLeft > 0 ? `Rolls left: ${props.yahtzee.gameState.rollsLeft}` :
            props.yahtzee.gameState.turn == props.yahtzee.currentAccount ? "Choose a category to end your turn" :
            "Waiting for other player..."
         }</p>
         <Overlay target={target.current} show={message == " "}>
                        {popover}
         </Overlay>
      </ActionsWrapper>
   );

   async function handleClick() {
      props.yahtzee.rollDice()
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
