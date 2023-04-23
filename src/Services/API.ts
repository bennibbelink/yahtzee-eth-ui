
import Web3 from 'web3'
import MetaMaskSDK from '@metamask/sdk';
import { State } from '../Types';

export default class Yahtzee {

    emptyAdd = "0x0000000000000000000000000000000000000000";
    contractAddress = "0x9D7d2d175C27aa5D9BF03bf4cB3E1B2482D77Dcd";
    instance: any
    MMSDK: MetaMaskSDK = new MetaMaskSDK({})
    ethereum: any;
    currentAccount: string = this.emptyAdd;
    privateKey: string | null = null;

    gameState: State  = {
        player1: this.emptyAdd,
        player2: this.emptyAdd,
        rollsLeft: 3,
        dice: Array(5).fill(1),
        turn: this.emptyAdd,
        player1_scores: Array(15).fill(-1),
        player2_scores: Array(15).fill(-1)
    };


    constructor() {
        console.log(this.gameState)
        this.construct()
        this.ethereum = this.MMSDK.getProvider();
        if (this.ethereum != undefined) {
            this.ethereum.request({ method: 'eth_requestAccounts', params: [] });
        }
        
    }

    async construct() {
        const web3 = new Web3(Web3.givenProvider);
        this.ethereum = this.MMSDK.getProvider();

        const chainId = await this.ethereum.request({ method: 'eth_chainId' });
        console.log(`Connecting to Chain ID: ${chainId}`);
        const accounts = await this.ethereum.request({method: 'eth_accounts'});
        this.handleAccountsChanged(accounts);
        
        const Yaht = require('../ContractABI/Yahtzee.json');
        const networkData = Yaht.networks[parseInt(chainId, 16)];
        this.instance = new web3.eth.Contract(Yaht.abi, networkData.address);
        let options = {};
        console.log(this.instance)

        this.instance.events.Turn(options) .on('data', (ev: any) => this.turnHandler(ev));
        this.instance.events.DiceState(options).on('data', (ev:  any) => this.diceStateHandler(ev));
        this.instance.events.ScoreState(options).on('data', (ev:any) => this.scoreStateHandler(ev));
        this.instance.events.GameOver(options).on('data', (ev: any) => this.gameOverHandler(ev));

        


        this.ethereum.on('accountsChanged', this.handleAccountsChanged);
        this.ethereum.on('chainChanged', this.handleChainChanged);


        await this.dumpScore();
        await this.dumpTurn();

    }

    diceStateHandler(ev: any) {
        console.log("DiceState event recieved")
        this.gameState.dice = ev.returnValues.dice;
    }

    scoreStateHandler(ev: any) {
        console.log("ScoreState event recieved")
        console.log(this.gameState)
        this.gameState.player1 = ev.returnValues.players[0];
        this.gameState.player2 = ev.returnValues.players[1];
        for (let i = 0; i < ev.returnValues.player_scores.length; i++) {
            this.gameState.player1_scores[i] = parseInt(ev.returnValues.player_scores[i][0]);
            this.gameState.player2_scores[i] = parseInt(ev.returnValues.player_scores[i][1]);
        }
    }

    gameOverHandler(ev: any) {
        console.log('GameOver event recieved');
    }

    turnHandler(ev: any) {
        console.log('Turn event recieved');
        this.gameState.turn = ev.returnValues.turn;
    }

    async dumpScore() {
        await this.instance.methods.score_dump().send({from: this.currentAccount, gas: 3000000})
    }

    async dumpTurn() {
        await this.instance.methods.turn_dump().send({from: this.currentAccount, gas: 3000000})
    }

    async rollDice(dice_indices: boolean[]) {
        let di = dice_indices;
        return new Promise(async (resolve, reject) => {
            console.log("sending roll_dice")
            await this.instance.methods.roll_dice(di[0], di[1], di[2], di[3], di[4]).send({from: this.currentAccount, gas: 3000000});
        });
    }

    async bankRoll(category: number) {
        return new Promise(async (resolve, reject) => {
            console.log("sending bank_roll")
            await this.instance.methods.bank_roll(category).send({from: this.currentAccount, gas: 3000000});
        });
    }

    async joinGame() {
        return new Promise(async (resolve, reject) => {
            console.log("sending join_game")
            let res = await this.instance.methods.join_game().send({from: this.currentAccount, gas: 3000000});
            console.log(res);
        });
    }


    handleChainChanged(_chainId: any) {
        // We recommend reloading the page, unless you must do otherwise
        window.location.reload();
    }

    handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== this.currentAccount) {
        this.currentAccount = accounts[0];
        console.log(`Current account: ${this.currentAccount}`)
        // Do any other work!
    }
    }

}


