import Card from "./card";

export const SUITS = ["Club", "Diamond", "Heart", "Spade"];
export const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function createDeck() {
    let deck = [];

    SUITS.forEach(s => {
        VALUES.forEach(v => {
            let card = new Card({
                name: `${s}${v}`,
                suit: s,
                value: v,
                order: getCardOrder(v)
            });
            card.anchor.set(0.5);
            card.scale.set(0.4);
            deck.push(card);
        });
    });

    return deck;
}

function getCardOrder(value) {
    switch (value) {
        case "A":
            return (14);
        case "K":
            return (13);
        case "Q":
            return (12);
        case "J":
            return (11);
        default:
            return (+value);
    }
}