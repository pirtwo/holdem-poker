import * as PIXI from "pixi.js";
import app from ".";
import Seat from "./seat";
import createDeck from "./deck";
import {
    shuffle
} from "./lib/utils";

export default class Holdem extends PIXI.Container {
    constructor() {
        super();

        this.state = undefined;
        this.players = [];

        this.pot = 0;
        this.minBet = 2;
        this.highestBet = 0;

        this.dealer = null;
        this.playerTurn = null;

        this.deck = createDeck();
        this.communityCards = [];

        // graphics
        this.tileset = app.loader.resources.tileset.textures;
        this.tween = window.tweenManager;
        this.table = new PIXI.Sprite(this.tileset["table.png"]);
        this.table.scale.set(1.5);
        this.table.position.set(
            app.screen.width / 2 - this.table.width / 2,
            app.screen.height / 2 - this.table.height / 2);

        // create seats
        this.seats = [];
        Object.keys(SEATS).forEach(key => {
            this.seats.push(new Seat({
                id: +key,
                side: SEATS[key].side,
                position: SEATS[key].position
            }));
        });

        // create dealer sign        
        this.dealerSign = new PIXI.Sprite(this.tileset["chipWhite_border.png"]);

        this.addChild(this.table, ...this.seats, ...this.deck);
    }

    join(player) {
        let seat = this.seats.find(n => n.player === null);

        if (seat) {
            player.seat = seat;
            seat.setPlayer(player);
            this.players.push(player);
            return true;
        } else {
            throw Error("no empty seat found.");
        }
    }

    leave(player) {

    }

    newGame() {
        this.state = new Bets(this);
        return this;
    }

    deal() {
        this.state.deal();
        return this;
    }

    bet(player, amount) {
        if (this.canBet(player, amount)) {
            this.pot += amount;
            this.highestBet = amount;
            player.balance -= amount;
            player.totalBets += amount;
            player.state = 'raise';
        }
    }

    call(player) {
        if (this.canCall(player)) {
            let amount = this.highestBet - player.totalBets;
            this.pot += amount;
            player.balance -= amount;
            player.totalBets += amount;
            player.state = 'call';
        }
    }

    check(player) {
        if (this.canCheck(player)) {
            player.state = 'check';
        }
    }

    fold(player) {
        if (this.canFold(player)) {
            player.state = 'fold';
            this.players.splice(this.players.indexOf(player), 1);
        }
    }

    endBeting() {
        this.state.endBeting();
        return this;
    }

    nextPlayerTurn() {
        let currPlayerIdx = this.players
            .filter(n => n.state != 'fold')
            .indexOf(this.playerTurn);

        this.playerTurn = currPlayerIdx + 1 < this.players.length ?
            this.players[currPlayerIdx + 1] : 0;
    }

    getSmallBlind() {
        return Math.floor(this.minBet / 2);
    }

    getBigBlind() {
        return this.minBet;
    }

    getSmallBlindPlayer() {
        let dealerIdx = this.players.indexOf(this.dealer);

        return dealerIdx + 1 < this.players.length ?
            this.players[dealerIdx + 1] : this.players[0];
    }

    getBigBlindPlayer() {
        let dealerIdx = this.players.indexOf(this.dealer);

        return dealerIdx + 2 < this.players.length ?
            this.players[dealerIdx + 2] :
            this.players[dealerIdx + 2 - this.players.length];
    }

    setNextDealer() {
        let dealerIdx = this.players.indexOf(this.dealer);
        this.dealer = dealerIdx + 1 < this.players.length ?
            this.players[dealerIdx + 1] : this.players[0];
    }

    canEndBeting() {
        return this.players.every(player =>
            player.totalBets === this.highestBet ||
            player.state === 'allin'
        );
    }

    canBet(player, amount) {
        return player.state != 'fold' &&
            this.playerTurn === player &&
            amount > this.highestBet;
    }

    canCall(player) {
        return player.state != 'fold' &&
            this.playerTurn === player &&
            player.balance > 0;
    }

    canCheck(player) {
        return player.state != 'fold' &&
            this.playerTurn === player &&
            this.highestBet === player.currBet;
    }

    canFold(player) {
        return player.state != 'fold' &&
            this.playerTurn === player;
    }
}

// game states
class Bets {
    constructor(game) {
        this.game = game;
        this.game.deck = shuffle(this.game.deck);
        this.game.setNextDealer();

        let players = this.game.players,
            dealerIdx = players.indexOf(this.game.dealer);

        this.game.playerTurn = dealerIdx + 3 < players.length ?
            players[dealerIdx + 3] :
            players[dealerIdx + 3 - players.length];

        players.forEach(p => {
            p.totalBets = 0;
            p.state = undefined;
        });

        this.game.getSmallBlindPlayer()
            .blind(this.game.getSmallBlind());
        this.game.getBigBlindPlayer()
            .blind(this.game.getBigBlind());
        this.game.pot = this.game.getSmallBlind() + this.game.getBigBlind();
        this.game.highestBet = this.game.getBigBlind();

        console.log("Bets")
    }

    deal() {
        throw Error(`not allowed to deal cards in ${this.toString().toUpperCase()} state.`);
    }

    endBeting() {
        this.game.state = new PreFlop(this.game);
    }

    toString() {
        return "bets";
    }
}

class PreFlop {
    constructor(game) {
        this.game = game;
        this.game.highestBet = 0;

        console.log('PreFlop')
    }

    deal() {
        console.log('preflop deal')
        let tween = window.tweenManager;

        this.game.players.forEach((p, idx) => {
            tween.wait(idx * 1000).then(() => {
                for (let i = 0; i < 2; i++) {
                    let card = this.game.deck.pop();
                    p.hand.push(card);
                    tween.wait(i * 300).then(() => {
                        tween.slide(
                            card,
                            p.seat.playerCards.position.x + i * 50,
                            p.seat.playerCards.position.y);
                    });
                }
            });
        });
    }

    endBeting() {
        this.game.state = new Flop(this.game);
    }

    toString() {
        return "preflop";
    }
}

class Flop {
    constructor(game) {
        this.game = game;
        this.game.highestBet = 0;

        console.log('Flop')
    }

    deal() {
        console.log('flop deal')

        let tween = window.tweenManager;

        this.game.deck.pop(); // burn a card

        for (let i = 0; i < 3; i++) {
            let card = this.game.deck.pop();
            this.game.communityCards.push(card);

            tween.wait(i * 300).then(() => {
                tween.slide(
                    card, app.screen.width / 2 + i * 50, app.screen.height / 2);
            });
        }
    }

    endBeting() {
        this.game.state = new Turn(this.game);
    }

    toString() {
        return "flop";
    }
}

class Turn {
    constructor(game) {
        this.game = game;
        this.game.highestBet = 0;

        console.log('Turn')
    }

    deal() {
        console.log('turn deal')

        let tween = window.tweenManager;

        this.game.deck.pop(); // burn a card

        let card = this.game.deck.pop();
        this.game.communityCards.push(card);
        tween.wait(300).then(() => {
            tween.slide(
                card, app.screen.width / 2 + 3 * 50, app.screen.height / 2);
        });
    }

    endBeting() {
        this.game.state = new River(this.game);
    }

    toString() {
        return "turn";
    }
}

class River {
    constructor(game) {
        this.game = game;
        this.game.highestBet = 0;

        console.log('River')
    }

    deal() {
        console.log('river deal')

        let tween = window.tweenManager;

        this.game.deck.pop(); // burn a card

        let card = this.game.deck.pop();
        this.game.communityCards.push(card);
        tween.wait(300).then(() => {
            tween.slide(
                card, app.screen.width / 2 + 4 * 50, app.screen.height / 2);
        });
    }

    endBeting() {
        this.game.state = new Showdown(this.game);
    }

    toString() {
        return "river";
    }
}

class Showdown {
    constructor(game) {
        this.game = game;
        this.game.highestBet = 0;

        console.log('Showdown')
    }

    deal() {
        throw Error(`not allowed to deal cards in ${this.toString().toUpperCase()} state.`);
    }

    toString() {
        return "showdown";
    }
}

// seats positions
const
    PADDING_X = 210,
    PADDING_Y = 170,
    TOP_X = 410,
    TOP_Y = 120,
    BOT_X = 830,
    BOT_Y = 600,
    LEFT_X = 200,
    LEFT_Y = 450,
    RIGHT_X = 1060,
    RIGHT_Y = 280;

const SEATS = {
    "1": {
        side: "top",
        position: new PIXI.Point(TOP_X, TOP_Y),
    },
    "2": {
        side: "top",
        position: new PIXI.Point(TOP_X + PADDING_X, TOP_Y),
    },
    "3": {
        side: "top",
        position: new PIXI.Point(TOP_X + PADDING_X * 2, TOP_Y),
    },
    "4": {
        side: "right",
        position: new PIXI.Point(RIGHT_X, RIGHT_Y),
    },
    "5": {
        side: "right",
        position: new PIXI.Point(RIGHT_X, RIGHT_Y + PADDING_Y),
    },
    "6": {
        side: "bot",
        position: new PIXI.Point(BOT_X, BOT_Y),
    },
    "7": {
        side: "bot",
        position: new PIXI.Point(BOT_X - PADDING_X, BOT_Y),
    },
    "8": {
        side: "bot",
        position: new PIXI.Point(BOT_X - PADDING_X * 2, BOT_Y),
    },
    "9": {
        side: "left",
        position: new PIXI.Point(LEFT_X, LEFT_Y),
    },
    "10": {
        side: "left",
        position: new PIXI.Point(LEFT_X, LEFT_Y - PADDING_Y),
    },
}