export default class Player {
    constructor(name, table, balance) {
        this.name = name;
        this.hand = [];
        this.table = table;
        this.seat = null;
        this.state = undefined;        
        this.totalBets = 0;
        this.balance = balance;
    }

    bet(amount) {
        this.table.bet(this, amount);
        this.seat.showBets(this.totalBets);
        this.seat.showBalance(this.balance);
    }

    check() {
        this.table.check(this);
    }

    call() {
        this.table.call(this);
        this.seat.showBets(this.totalBets);
        this.seat.showBalance(this.balance);
    }

    fold() {
        this.table.fold(this);
        this.seat.showBets(this.totalBets);
        this.seat.showBalance(this.balance);
    }

    blind(amount) {
        this.totalBets += amount;
        this.balance -= amount;
        this.seat.showBets(this.totalBets);
        this.seat.showBalance(this.balance);
    }
}