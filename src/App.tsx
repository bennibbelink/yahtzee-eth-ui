import React, {useState, useEffect} from 'react';
import './App.css';
import {Form, Input} from './App.styled'
import Scoreboard from './Components/Scoreboard/Scoreboard';
import Dice from './Components/Dice/Dice';
import Actions from './Components/Actions/Actions';
import Yahtzee from './Services/API';
import { State } from './Types';
import { Button } from './Components/Actions/Actions.styled';



function App() {
  const init_state = {
    player1: Yahtzee.emptyAdd,
    player2: Yahtzee.emptyAdd,
    rollsLeft: 3,
    dice: Array(5).fill(1),
    selected: Array(5).fill(true),
    turn: Yahtzee.emptyAdd,
    player1_scores: Array(15).fill(-1),
    player2_scores: Array(15).fill(-1)
  };
  const [yahtzee, setYahtzee] = useState<Yahtzee>();
  const [state, setState] = useState<State>(init_state);

  // const [selected, setSelected] = useState<boolean[]>([true, true, true, true, true]);
  const [rolling, setRolling] = useState<boolean>(false);

  // local state vars
  const [address, setAddress] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);

  // 0: not in game
  // 1: in game first
  // 2: in started game
  const [playerStatus, setPlayerStatus] = useState<number>(0);
  const NOT_IN_GAME = 0;
  const IN_GAME_FIRST = 1;
  const IN_STARTED_GAME = 2;
  const NOT_IN_STARTED_GAME = 3;


  useEffect(() => {
    if (chainId === "")
      getChainId();
    if (yahtzee) {
      console.log(yahtzee.gameState);
      setPlayerStatus(getPlayerStatus());
    }
  });

  function getPlayerStatus(): number {
    if (yahtzee) {
      if (state.turn !== Yahtzee.emptyAdd) { // there is a game in progress
        if (state.player1 === yahtzee.currentAccount || state.player2 === yahtzee.currentAccount) { // we are in it
          return IN_STARTED_GAME;
        } else {
          return NOT_IN_STARTED_GAME;
        }
      } else {
        if (state.player1 === yahtzee.currentAccount) { // we are waiting for a player
          return IN_GAME_FIRST;
        } else { // we aren't in an available game 
          return NOT_IN_GAME;
        }
      }
    } else {
      return -1;
    }
  }

  
  
  return (
    <div className="App">
      <header className="App-header">
            <h1>YahtzeEth</h1>
            { 
              yahtzee && playerStatus >= 0 ? (
                playerStatus === NOT_IN_STARTED_GAME ?  <div>Game in progress, please wait for the next game to start.</div> :
                playerStatus === IN_GAME_FIRST ? <div> Waiting for another player to join... </div> : 
                playerStatus === IN_STARTED_GAME ? 
                    <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center'}}>
                      <Scoreboard yahtzee={yahtzee}/>
                      <Dice yahtzee={yahtzee} rolling={rolling}/>
                      <Actions yahtzee={yahtzee}></Actions>
                    </div> :
                playerStatus === NOT_IN_GAME ?
                    <button onClick={() => {yahtzee.joinGame()}}>Join game</button> : null
              )

              :
              
              <Form onSubmit={handleSubmit}>
                <div className="form-group">
                <label> Current Chain ID: {chainId}</label>
                </div>
                <div className="form-group">
                <label>Enter your account address:
                  <Input type="text" value={address} onChange={(e) => {setAddress(e.target.value)}}/>
                </label>
                </div>
                <div className="form-group">
                <label>Enter your account's private key:
                  <Input type="text" value={key} onChange={(e) => {setKey(e.target.value)}}/>
                </label>
                </div>
                <div className="form-group">
                <label>Remember me?
                  <Input type="checkbox" checked={remember} onChange={() => {setRemember(!remember)}} />
                </label>
                </div>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
                <p>{playerStatus < 0 ? "There was an error with your account info. Please re-enter your information" : ""}</p>
              </Form>              
            }
      </header>
    </div>
  );

  async function handleSubmit() {
    let y: Yahtzee = new Yahtzee(address, key, state, setState, rolling, setRolling);
    await y.setup();
    if (remember) {
      localStorage.setItem('address', address);
      localStorage.setItem('privateKey', key);
    } else {
      localStorage.clear();
    }
    setYahtzee(y)
  }

  async function getChainId() {
    setChainId(await Yahtzee.getChainId());
    let localAdd = localStorage.getItem('address');
    let localKey = localStorage.getItem('privateKey');
    if (localAdd && localKey)  {
      setAddress(localAdd);
      setKey(localKey);
      setRemember(true);
    }
  }




  



}








export default App;
