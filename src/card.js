import app from ".";
import {
    Sprite
} from "pixi.js";

export default class Card extends Sprite {
    constructor({
        name,
        suit,
        value,
        order,
    }) {
        super();

        this.tileset = app.loader.resources.tileset.textures;
        this.texture = this.tileset["cardBack_blue5.png"];
        this.name = name;
        this.suit = suit;
        this.value = value;
        this.order = order;
    }

    reveal() {
        this.texture = this.tileset[`card${this.suit}s${this.value}.png`];
    }
}