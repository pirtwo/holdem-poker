import {
    Container
} from "pixi.js";

export default class Room extends PIXI.Container {
    constructor(textures) {
        this.textures = textures;
    }
}