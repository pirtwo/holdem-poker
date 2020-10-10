export default class Player {
    constructor(table, balance) {
        this.table = table;
        this.state = undefined;
        this.hand = [];
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