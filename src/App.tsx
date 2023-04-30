import {useState, useEffect} from 'react';
import './App.css';
import {StyledButton, StyledForm, StyledInput, StyledLabel} from './App.styled'
import Scoreboard from './Components/Scoreboard/Scoreboard';
import Dice from './Components/Dice/Dice';
import Actions from './Components/Actions/Actions';
import Yahtzee from './Services/API';
import { GameOver, State } from './Types';



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



  const [gameOver, setGameOver] = useState<GameOver | null>(null);


  useEffect(() => {
    if (chainId === "")
      getChainId();
    if (yahtzee) {
      // console.log(yahtzee.gameState);
      setPlayerStatus(getPlayerStatus());
      console.log(playerStatus)
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
      </header>
      <body className="App-body">
      { 
              yahtzee ? (
                gameOver ? 
                <StyledForm>
                  <StyledLabel>{gameOver.winner == yahtzee.currentAccount ? "You won!!!" : "You lost!!!"}</StyledLabel>
                  <StyledLabel>{gameOver.winner == yahtzee.gameState.player1 ? gameOver.winning_score : gameOver.losing_score} 
                  - {gameOver.winner == yahtzee.gameState.player2 ? gameOver.winning_score : gameOver.losing_score}</StyledLabel>
                  <StyledButton onClick={async () => {
                      await yahtzee.dumpTurn();
                      await yahtzee.dumpScore();
                      await yahtzee.dumpDice();
                      await yahtzee.joinGame();
                      setState(init_state);
                      setGameOver(null);
                    }}>Play again!</StyledButton>
                </StyledForm> :
                playerStatus === NOT_IN_STARTED_GAME ?  <div>Game in progress, please wait for the next game to start.</div> :
                playerStatus === IN_GAME_FIRST ? <div> Waiting for another player to join... </div> : 
                playerStatus === IN_STARTED_GAME ? (
                    <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center'}}>
                      <Scoreboard yahtzee={yahtzee}/>
                      <Dice yahtzee={yahtzee} rolling={rolling}/>
                      <Actions yahtzee={yahtzee}></Actions>
                    </div> 
                ) :
                playerStatus === NOT_IN_GAME ? 
                  <StyledButton onClick={() => {yahtzee.joinGame()}}>Join game</StyledButton> 
                :
                null
              )

              :
              
              <StyledForm onSubmit={handleSubmit}>
                <StyledLabel> Current Chain ID: {chainId}</StyledLabel>

                <StyledLabel>Enter your account address
                  <StyledInput type="text" value={address} onChange={(e: any) => {setAddress(e.target.value)}}/>
                </StyledLabel>

                <StyledLabel>Enter your account's private key
                  <StyledInput type="text" value={key} onChange={(e: any) => {setKey(e.target.value)}}/>
                </StyledLabel>

                <StyledLabel>Remember me?
                  <StyledInput type="checkbox" checked={remember} onChange={() => {setRemember(!remember)}} />
                </StyledLabel>

                <StyledButton type="button" onClick={handleSubmit}>Submit</StyledButton>
                <p>{playerStatus < 0 ? "There was an error with your account info. Please re-enter your information" : ""}</p>
              </StyledForm>              
            }
      </body>
    </div>
  );

  async function handleSubmit() {
    let y: Yahtzee = new Yahtzee(address, key, state, setState, rolling, setRolling, setGameOver);
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
