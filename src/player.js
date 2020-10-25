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
    }

    check() {
        this.table.check(this);
    }

    call() {
        this.table.call(this);
    }

    fold() {
        this.table.fold(this);
    }

    blind(amount) {
        this.totalBets += amount;
        this.balance -= amount;
    }
}