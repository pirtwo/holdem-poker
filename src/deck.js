import app from ".";
import {
    Sprite
} from "pixi.js";

const types = ["Club", "Diamond", "Heart", "Spade"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export default function createDeck() {
    let deck = [];

    types.forEach(t => {
        values.forEach(v => {
            let card = new Card({
                type: t,
                value: v,
                name: `${t}${v}`
            });
            card.anchor.set(0.5);
            card.scale.set(0.3);
            deck.push(card);
        });
    });

    return deck;
}

class Card extends Sprite {
    constructor({
        type,
        value,
        name,
    }) {
        super();

        this.tileset = app.loader.resources.tileset.textures;
        this.texture = this.tileset["cardBack_blue5.png"];
        this.name = name;
        this.type = type;
        this.value = value;
    }

    reveal() {
        this.texture = this.tileset[`card${this.type}s${this.value}.png`];
    }
}