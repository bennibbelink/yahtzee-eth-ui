import React, {useState, useEffect} from 'react';
import './App.css';
import Scoreboard from './Components/Scoreboard/Scoreboard';
import Dice from './Components/Dice/Dice';
import Actions from './Components/Actions/Actions';
import { MetamaskStateProvider } from "use-metamask";
import { useMetaMask } from 'metamask-react'
import Yahtzee from './Services/API';



function App() {

  const [yahtzee, ] = useState<Yahtzee>(new Yahtzee());

  const [selected, setSelected] = useState<boolean[]>([true, true, true, true, true]);

  // const [player, setPlayer] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  // const { status, connect, account, chainId, ethereum } = useMetaMask();


  useEffect(() => {
    yahtzee.dumpScore().then(() => {
      yahtzee.dumpTurn().then(() => {
        setLoading(false);
      });
    });
  });

  function isInGameFirst(): boolean {
    return (yahtzee.currentAccount === yahtzee.gameState.player1 || yahtzee.currentAccount === yahtzee.gameState.player2) 
      && yahtzee.emptyAdd === yahtzee.gameState.player2;
  }

  function isInStartedGame(): boolean {
    console.log(yahtzee.gameState.turn)
    return (yahtzee.currentAccount === yahtzee.gameState.player1 || yahtzee.currentAccount === yahtzee.gameState.player2)
      && yahtzee.gameState.turn !== yahtzee.emptyAdd;
  }

  function notInGame(): boolean {
    return (yahtzee.currentAccount !== yahtzee.gameState.player1 && yahtzee.currentAccount !== yahtzee.gameState.player2
      && yahtzee.gameState.turn !== yahtzee.emptyAdd)
  }
  
  return (
    <MetamaskStateProvider>
    <div className="App">
      <header className="App-header">

            <h1>Blockchain Yahtzee</h1>
            {/* <button onClick={() => {setPlayer((player + 1) % 2)}}>player: {player}</button> */}

            { 
              loading ? null :
              notInGame() ? <div>Game in progress, please wait for the next game to start.</div> :
              isInGameFirst() ? <div> Waiting for other player to join</div> : 
              isInStartedGame() ? 
              <div>
                <Scoreboard yahtzee={yahtzee} selected={selected}/>
                <Dice state={yahtzee.gameState} selected={selected} setSelected={setSelected}/>
                <Actions yahtzee={yahtzee} selected={selected}></Actions>
              </div> 
              :
              <button onClick={() => {yahtzee.joinGame()}}>Join game</button>
            }
      
      </header>
    </div>
    </MetamaskStateProvider>
  );
}

export default App;
