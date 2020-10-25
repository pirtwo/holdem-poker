import * as PIXI from "pixi.js";
import * as utils from "./lib/utils";
import Sound from "pixi-sound";
import Stats from "stats.js";
import Charm from "./lib/charm";
import Room from "./holdem";
import Player from "./player";
import Holdem from "./holdem";

const app = new PIXI.Application({
    backgroundColor: 0x1099bb,
    width: 1280,
    height: 720,
    antialias: true,
});

function init() {
    document.body.appendChild(app.view);
    utils.scaleToWindow(app.view);
    app.loader
        .add('tileset', './assets/sprites/tileset.json')
        .load(setup);
}

function setup(loader, resources) {
    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    window.tweenManager = new Charm(app);

    let tileset = resources.tileset.textures;
    let holdem = new Holdem();
    let backgroundColor = new PIXI.TilingSprite(
        tileset["background.png"], app.screen.width, app.screen.height);

    app.stage.addChild(backgroundColor, holdem);

    for (let i = 0; i < 10; i++) {
        holdem.join(new Player(`Player-${i+1}`, holdem, 100));
    }

    holdem.newGame()
        .endBeting()
        .deal()
        .endBeting()
        .deal()
        .endBeting()
        .deal()
        .endBeting()
        .deal();

    // game loop
    app.ticker.add((delta) => {
        stats.begin();

        // update game here
        window.tweenManager.update();

        stats.end();
    });
}

init();

export default app;