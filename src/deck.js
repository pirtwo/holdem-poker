const types = ["club", "diamond", "heart", "spade"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export default function getDeck() {
    let deck = [];

    types.forEach(t => {
        values.forEach(v => {
            deck.push({
                type: t,
                value: v,
                name: `${t}${v}`
            });
        });
    });

    return deck;
}