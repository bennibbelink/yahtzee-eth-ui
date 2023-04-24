
import Web3 from 'web3'
import { State } from '../Types';

export default class Yahtzee {

    static emptyAdd = "0x0000000000000000000000000000000000000000";
    contractAddress = "0x9D7d2d175C27aa5D9BF03bf4cB3E1B2482D77Dcd";
    instance: any
    static ethereum: any = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8546').eth;
    currentAccount: string = Yahtzee.emptyAdd;
    key: string = Yahtzee.emptyAdd;
    chainId: any;

    gameState: State  = {
        player1: Yahtzee.emptyAdd,
        player2: Yahtzee.emptyAdd,
        rollsLeft: 3,
        dice: Array(5).fill(1),
        turn: Yahtzee.emptyAdd,
        player1_scores: Array(15).fill(-1),
        player2_scores: Array(15).fill(-1)
    };

    setState;


    constructor(address: string, privateKey: string, state: State, setState: React.Dispatch<React.SetStateAction<State>>) {
        this.currentAccount = address;
        this.key = privateKey;
        this.gameState = state;
        this.setState = setState;
    }

    async setup() {        
        const Yaht = require('../ContractABI/Yahtzee.json');
        const networkData = Yaht.networks[await Yahtzee.getChainId()];
        this.instance = new Yahtzee.ethereum.Contract(Yaht.abi, networkData.address);

        let options = {};
        this.instance.events.Turn(options).on('data', (ev: any) => this.turnHandler(ev));
        this.instance.events.DiceState(options).on('data', (ev:  any) => this.diceStateHandler(ev));
        this.instance.events.ScoreState(options).on('data', (ev:any) => this.scoreStateHandler(ev));
        this.instance.events.GameOver(options).on('data', (ev: any) => this.gameOverHandler(ev));

        await this.dumpScore();
        await this.dumpTurn();
        await this.dumpDice();
    }

    diceStateHandler(ev: any) {
        console.log("DiceState event recieved")
        this.gameState.dice = ev.returnValues.dice;
        let shallow = Object.assign({}, this.gameState);
        this.setState(shallow);
    }

    scoreStateHandler(ev: any) {
        console.log("ScoreState event recieved")
        this.gameState.player1 = ev.returnValues.players[0];
        this.gameState.player2 = ev.returnValues.players[1];
        for (let i = 0; i < ev.returnValues.player_scores.length; i++) {
            this.gameState.player1_scores[i] = parseInt(ev.returnValues.player_scores[i][0]);
            this.gameState.player2_scores[i] = parseInt(ev.returnValues.player_scores[i][1]);
        }
        console.log("SCORESTATE UPDATED")
        console.log(this.gameState)
        let shallow = Object.assign({}, this.gameState);
        this.setState(shallow);
    }

    gameOverHandler(ev: any) {
        console.log('GameOver event recieved');
    }

    turnHandler(ev: any) {
        console.log('Turn event recieved');
        this.gameState.turn = ev.returnValues.turn;
        let shallow = Object.assign({}, this.gameState);
        this.setState(shallow);
    }

    async dumpScore() {
        const query = this.instance.methods.score_dump();
        await this.sendSignedTransaction(query);
    }

    async dumpTurn() {
        const query = this.instance.methods.turn_dump();
        await this.sendSignedTransaction(query);
    }

    async dumpDice() {
        const query = this.instance.methods.dice_dump();
        await this.sendSignedTransaction(query);
    }

    async rollDice(di: boolean[]) {
        console.log("sending roll_dice")
        const query = this.instance.methods.roll_dice(di[0], di[1], di[2], di[3], di[4]);
        await this.sendSignedTransaction(query);
    }

    async bankRoll(category: number) {
        console.log("sending bank_roll")
        const query = this.instance.methods.bank_roll(category);
        await this.sendSignedTransaction(query);
    }

    async joinGame() {
        console.log('sending join_game');
        const query = this.instance.methods.join_game();
        let res = await this.sendSignedTransaction(query);
        console.log(res)
    }

    async sendSignedTransaction(query: any): Promise<any> {
        const encodedABI = query.encodeABI();
        console.log('in sendsignedtransaction')
        const nonce = await Yahtzee.ethereum.getTransactionCount(this.currentAccount, 'latest');
        console.log(`nonce is ${nonce}`)
        const signedTx = await Yahtzee.ethereum.accounts.signTransaction(
        {
            data: encodedABI,
            from: this.currentAccount,
            gas: 3000000,
            gasPrice: 2000000000,
            to: this.instance.options.address,
            nonce: nonce
        },
        this.key,
        false,
        );
        let res = await Yahtzee.ethereum.sendSignedTransaction(signedTx.rawTransaction);
        console.log(res)
        return res;
    }


    static async getChainId(): Promise<string> {
        let id = await Yahtzee.ethereum.getChainId();
        return id;
    }

}


