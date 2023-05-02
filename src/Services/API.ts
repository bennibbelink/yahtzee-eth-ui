
import Web3 from 'web3'
import { GameOver, State } from '../Types';

export default class Yahtzee {

    static emptyAdd = "0x0000000000000000000000000000000000000000";
    instance: any
    static web3: any = new Web3(new Web3.providers.WebsocketProvider(process.env.PROVIDER ? process.env.PROVIDER : 'ws://127.0.0.1:8545'))
    static ethereum: any = Yahtzee.web3.eth;
    currentAccount: string = Yahtzee.emptyAdd;
    key: string = Yahtzee.emptyAdd;
    chainId: any;

    gameState: State  = {
        player1: Yahtzee.emptyAdd,
        player2: Yahtzee.emptyAdd,
        rollsLeft: 3,
        dice: Array(5).fill(1),
        selected: Array(5).fill(false),
        turn: Yahtzee.emptyAdd,
        player1_scores: Array(15).fill(-1),
        player2_scores: Array(15).fill(-1)
    };
    setState: React.Dispatch<React.SetStateAction<State>>;
    rolling: boolean;
    setRolling: React.Dispatch<React.SetStateAction<boolean>>;
    setGameOver: React.Dispatch<React.SetStateAction<GameOver | null>>;


    constructor(address: string, privateKey: string, state: State, setState: React.Dispatch<React.SetStateAction<State>>, 
        rolling: boolean, setRolling: React.Dispatch<React.SetStateAction<boolean>>,
        setGameOver: React.Dispatch<React.SetStateAction<GameOver | null>>) 
        {
        this.currentAccount = address.toLowerCase();
        this.key = privateKey;
        this.gameState = state;
        this.setState = setState;
        this.rolling = rolling;
        this.setRolling = setRolling;
        this.setGameOver = setGameOver;
    }

    async setup() {        
        const Yaht = require('../ContractABI/Yahtzee.json');
        const networkData = Yaht.networks[await Yahtzee.getChainId()];
        this.instance = new Yahtzee.ethereum.Contract(Yaht.abi, networkData['address']);

        let options = {fromBlock: 'finalized'};
        this.instance.events.Turn(options).on('data', (ev: any) => this.turnHandler(ev));
        this.instance.events.DiceState(options).on('data', (ev: any) => this.diceStateHandler(ev));
        this.instance.events.ScoreState(options).on('data', (ev: any) => this.scoreStateHandler(ev));
        this.instance.events.GameOver(options).on('data', (ev: any) => this.gameOverHandler(ev));
        this.instance.events.Selected(options).on('data', (ev: any) => this.selectedHandler(ev));

        await this.dumpScore();
        await this.dumpTurn();
        await this.dumpDice();
    }

    diceStateHandler(ev: any) {
        console.log("DiceState event recieved")
        this.setRolling(true);
        setTimeout(() => {
            this.setRolling(false);
            this.gameState.dice = ev.returnValues.dice;
            this.gameState.rollsLeft = ev.returnValues.rollsLeft
            let shallow = Object.assign({}, this.gameState);
            this.setState(shallow);
        }, 750); 
    }

    scoreStateHandler(ev: any) {
        console.log("ScoreState event recieved")
        this.gameState.player1 = ev.returnValues.players[0].toLowerCase();
        this.gameState.player2 = ev.returnValues.players[1].toLowerCase();
        for (let i = 0; i < ev.returnValues.player_scores.length; i++) {
            this.gameState.player1_scores[i] = parseInt(ev.returnValues.player_scores[i][0]);
            this.gameState.player2_scores[i] = parseInt(ev.returnValues.player_scores[i][1]);
        }
        console.log(this.gameState)
        let shallow = Object.assign({}, this.gameState);
        this.setState(shallow);
    }

    gameOverHandler(ev: any) {
        console.log('GameOver event recieved')
        let go: GameOver = {
            winner: ev.returnValues.winner,
            loser: ev.returnValues.loser,
            winning_score: ev.returnValues.winning_score,
            losing_score: ev.returnValues.losing_score
        };
        this.setGameOver(go);
    }

    turnHandler(ev: any) {
        console.log('Turn event recieved');
        this.gameState.turn = ev.returnValues.turn;
        let shallow = Object.assign({}, this.gameState);
        this.setState(shallow);
    }

    selectedHandler(ev: any) {
        console.log('Selected event recieved');
        this.gameState.selected = ev.returnValues.selected;
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

    async rollDice(): Promise<string> {
        console.log("sending roll_dice")
        return new Promise<string>((resolve, reject) => {
            const query = this.instance.methods.roll_dice();
            this.sendSignedTransaction(query).then((result) => {
                resolve(result);
            })
            .catch((err: Error) => {
                reject(this.parseError(err));                
            });
        });
    }

    async toggleSelectDie(ind: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const query = this.instance.methods.toggle_select_die(ind);
            this.sendSignedTransaction(query).then((result) => {
                resolve(result);
            })
            .catch((err: Error) => {
                reject(this.parseError(err));                
            });
        });
    }

    async bankRoll(category: number): Promise<string> {
        console.log("sending bank_roll")
        return new Promise<string>((resolve, reject) => {
            const query = this.instance.methods.bank_roll(category);
            this.sendSignedTransaction(query).then(result => {
                resolve(result);
            }).catch((err: any) => {
                console.log(err)
                reject(this.parseError(err));
            });
        });
    }

    async joinGame(): Promise<string> {
        console.log('sending join_game');
        return new Promise<string>((resolve, reject) => {
            const query = this.instance.methods.join_game();
            this.sendSignedTransaction(query).then(result => {
                resolve(result);
            }).catch((err: Error) => {
                reject(this.parseError(err));
            });
        });
    }

    async sendSignedTransaction(query: any): Promise<any> {
        const encodedABI = query.encodeABI();
        const signedTx = await Yahtzee.ethereum.accounts.signTransaction(
            {
                data: encodedABI,
                from: this.currentAccount,
                gas: 3000000,
                gasPrice: 20000000000,
                to: this.instance.options.address,
            },
            this.key
        );
        return Yahtzee.ethereum.sendSignedTransaction(signedTx.rawTransaction);
    }


    static async getChainId(): Promise<string> {
        let id = await Yahtzee.ethereum.getChainId();
        return id;
    }

    parseError(err: Error): string {
        console.log(err)
        let lines = err.message.split('\n')
        lines.splice(0,1)
        let combined = lines.join('\n');
        try {
            let obj: {data: {reason: string}} = JSON.parse(combined);
            if (obj.data.reason)
                return obj.data.reason;
        }
        catch (err) {
            console.log(err)
        }
        return "error?"
        
        
    }

}


