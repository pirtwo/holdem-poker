import getDeck from "./deck";
import {
    shuffle
} from "./lib/utils";

export default class HoldemTable {
    constructor() {
        this.state = new Bets(this);
        this.seats = new Array(6).fill(undefined);

        this.pot = 0;
        this.minBet = 2;
        this.highestBet = 0;

        this.dealer = null;
        this.playerTurn = null;

        this.deck = [];
        this.communityCards = [];
    }

    join(player) {
        for (let i = 0; i < this.seats.length; i++) {
            if (this.seats[i] === undefined) {
                this.seats[i] = player;
                return true;
            }
        }
        return false;
    }

    leave(player) {
        return delete this.seats[this.seats.indexOf(player)];
    }

    deal() {
        this.state.deal();
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
            this.getPlayers().splice(this.getPlayers().indexOf(player), 1);
        }
    }

    nextPlayerTurn() {
        let currPlayerIdx = this.getPlayers()
            .filter(n => n.state != 'fold')
            .indexOf(this.playerTurn);

        this.playerTurn = currPlayerIdx + 1 < this.getPlayers().length ?
            this.getPlayers()[currPlayerIdx + 1] : 0;
    }

    getPlayers() {
        return this.seats.filter(seat => seat != undefined);
    }

    getSmallBlind() {
        return Math.floor(this.minBet / 2);
    }

    getBigBlind() {
        return this.minBet;
    }

    getSmallBlindPlayer() {
        let players = this.getPlayers(),
            dealerIdx = players.indexOf(this.dealer);

        return dealerIdx + 1 < players.length ? players[dealerIdx + 1] : players[0];
    }

    getBigBlindPlayer() {
        let players = this.getPlayers(),
            dealerIdx = players.indexOf(this.dealer);

        return dealerIdx + 2 < players.length ?
            players[dealerIdx + 2] : players[dealerIdx + 2 - players.length];
    }

    setNextDealer() {
        let players = this.getPlayers(),
            dealerIdx = players.indexOf(this.dealer);
        this.dealer = dealerIdx + 1 < players.length ? players[dealerIdx + 1] : players[0];
    }

    canEndBeting() {
        return this.getPlayers().every(player =>
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


class Bets {
    constructor(table) {
        this.table = table;
        this.table.deck = shuffle(getDeck());
        this.table.setNextDealer();

        let players = this.table.getPlayers(),
            dealerIdx = players.indexOf(this.table.dealer);

        this.table.playerTurn = dealerIdx + 3 < players.length ?
            players[dealerIdx + 3] :
            players[dealerIdx + 3 - players.length];

        players.forEach(p => {
            p.totalBets = 0;
            p.state = undefined;
        });

        this.table.getSmallBlindPlayer().blind(this.table.getSmallBlind());
        this.table.getBigBlindPlayer().blind(this.table.getBigBlind());
        this.table.pot = this.table.getSmallBlind() + this.table.getBigBlind();
        this.table.highestBet = this.table.getBigBlind();
    }

    deal() {
        throw Error(`not allowed to deal cards in ${this.toString().toUpperCase()} state.`);
    }

    endBeting() {
        this.table.state = new PreFlop(this.table);
    }

    toString() {
        return "bets";
    }
}

class PreFlop {
    constructor(table) {
        this.table = table;
        this.table.highestBet = 0;
    }

    deal() {
        this.table
            .getPlayers()
            .forEach(p => p.hand.push(this.table.deck.pop(), this.table.deck.pop()));
    }

    endBeting() {
        this.table.state = new Flop(this.table);
    }

    toString() {
        return "preflop";
    }
}

class Flop {
    constructor(table) {
        this.table = table;
        this.table.highestBet = 0;
    }

    deal() {
        this.table.deck.pop(); // burn a card
        this.table.communityCards.push(
            this.table.deck.pop(),
            this.table.deck.pop(),
            this.table.deck.pop());
    }

    endBeting() {
        this.table.state = new Turn(this.table);
    }

    toString() {
        return "flop";
    }
}

class Turn {
    constructor(table) {
        this.table = table;
        this.table.highestBet = 0;
    }

    deal() {
        this.table.deck.pop(); // burn a card
        this.table.communityCards.push(this.table.deck.pop());
    }

    endBeting() {
        this.table.state = new River(this.table);
    }

    toString() {
        return "turn";
    }
}

class River {
    constructor(table) {
        this.table = table;
        this.table.highestBet = 0;
    }

    deal() {
        this.table.deck.pop(); // burn a card
        this.table.communityCards.push(this.table.deck.pop());
    }

    endBeting() {
        this.table.state = new Showdown(this.table);
    }

    toString() {
        return "river";
    }
}

class Showdown {
    constructor(table) {
        this.table = table;
        this.table.highestBet = 0;
    }

    deal() {
        throw Error(`not allowed to deal cards in ${this.toString().toUpperCase()} state.`);
    }

    toString() {
        return "showdown";
    }
}