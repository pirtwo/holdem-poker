import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import Stats from "stats.js";
import * as utils from "./lib/utils";
import Charm from "./lib/charm";

const app = new PIXI.Application({
    backgroundColor: 0x1099bb,
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
});

function init() {
    // load assets and fontse
    document.body.appendChild(app.view);
    utils.scaleToWindow(app.view);
    app.loader.add('tileset', './assets/sprites/tileset.json').load(setup);
}

function setup(loader, resources) {
    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const tweenManager = new Charm(app);
    const tileset = resources.tileset.textures;
    const room = createRoom(900, 480, 6, tileset);


    // room.addChild(dealerSign);
    // dealerSign.anchor.set(0.5);
    // dealerSign.position.set(app.screen.width / 2, app.screen.height / 2);
    // dealerSign.interactive = true;
    // dealerSign.buttonMode = true;
    // dealerSign.on("pointerdown", () => {
    //     playerPositions.forEach((pos, idx) => {
    //         console.log(pos)
    //         utils.wait(idx * 500).promise.then(() => {
    //             for (let i = 0; i < 2; i++) {
    //                 let card = new PIXI.Sprite(tileset["cardBack_red5.png"]);
    //                 card.anchor.set(0.5);
    //                 card.scale.set(0.3);
    //                 card.position.set(app.screen.width / 2, 200);
    //                 room.addChild(card);
    //                 utils.wait(i * 200).promise.then(() => {
    //                     tweenManager.slide(card, pos.x + i * 20, pos.y, 20);
    //                 });
    //             }
    //         });
    //     });
    // });

    app.stage.addChild(room);

    // game loop
    app.ticker.add((delta) => {
        stats.begin();

        // update game here
        tweenManager.update();

        stats.end();
    });
}

function createCards(tileset) {
    let deck = [];
    const types = ["club", "diamond", "heart", "spade"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    types.forEach(t => {
        values.forEach(v => {
            let cardType = t;
            cardType = cardType.split("");
            cardType[0] = cardType[0].toUpperCase();
            cardType = cardType.join("");
            let sp = new PIXI.Sprite(tileset[`card${cardType}s${v}.png`]);
            sp.cardName = `${t}${v}`;
            deck.push(sp);
        })
    });

    return deck;
}

function createChips(tileset) {

}

function createSeats(number) {
    let ctx = new PIXI.Graphics();
    let seats = [];

    ctx.beginFill(0xffffff);
    ctx.drawCircle(0, 0, 50);
    ctx.endFill();

    for (let i = 0; i < number; i++) {
        seats.push(new PIXI.Sprite(app.renderer.generateTexture(ctx)));
    }

    return seats;
}

function createDealerSign() {
    let ctx = new PIXI.Graphics();
    ctx.lineStyle(2, 0xcecece);
    ctx.beginFill(0xffffff);
    ctx.drawCircle(0, 0, 15);
    ctx.endFill();

    let sign = new PIXI.Container();
    let text = new PIXI.Text("D", new PIXI.TextStyle({
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Arial"
    }));

    sign.addChild(new PIXI.Sprite(app.renderer.generateTexture(ctx)));
    sign.addChild(text);
    text.position.set(sign.width / 2 - text.width / 2, sign.height / 2 - text.height / 2);

    return new PIXI.Sprite(app.renderer.generateTexture(sign));
}

function createRoom(tableWidth, tableHeight, seatNumber, tileset) {
    let room = new PIXI.Container();

    let table = new PIXI.Sprite(tileset["table.png"]);
    let cards = createCards(tileset);
    let chips = createChips(tileset);
    let seats = createSeats(seatNumber);
    let dealerSign = createDealerSign();
    let background = new PIXI.TilingSprite(tileset["background.png"], app.screen.width, app.screen.height);

    // set seats positions
    let currDist = 0,
        tableArea = (tableWidth + tableHeight) * 2,
        seatDist = tableArea / seatNumber,
        tableX = app.screen.width / 2 - tableWidth / 2,
        tableY = app.screen.height / 2 - tableHeight / 2;

    for (let i = 0; i < seatNumber; i++) {
        let seat = seats[i];
        seat.anchor.set(0.5);

        if (currDist < tableWidth) {
            seat.avatarPos =
                new PIXI.Point(tableX + currDist, tableY);
            seat.cardsPos =
                new PIXI.Point(tableX + currDist, tableY);
            seat.dealerPos =
                new PIXI.Point(tableX + currDist, tableY);
            seat.chipsPos =
                new PIXI.Point(tableX + currDist, tableY);

        } else if (currDist < tableWidth + tableHeight) {
            console.log(currDist)
            seat.avatarPos =
                new PIXI.Point(tableX + tableWidth, tableY + currDist - tableWidth);
            seat.cardsPos =
                new PIXI.Point(tableX + tableWidth, tableY + currDist - tableWidth);
            seat.dealerPos =
                new PIXI.Point(tableX + tableWidth, tableY + currDist - tableWidth);
            seat.chipsPos =
                new PIXI.Point(tableX + tableWidth, tableY + currDist - tableWidth);

        } else if (currDist < tableWidth * 2 + tableHeight) {
            seat.avatarPos = new PIXI.Point(
                (tableX + tableWidth) - (currDist - tableWidth + tableHeight),
                tableY + tableHeight);
            seat.cardsPos = new PIXI.Point(
                (tableY + tableWidth) - (currDist - tableWidth + tableHeight),
                tableY + tableHeight);
            seat.dealerPos = new PIXI.Point(
                (tableY + tableWidth) - (currDist - tableWidth + tableHeight),
                tableY + tableHeight);
            seat.chipsPos = new PIXI.Point(
                (tableY + tableWidth) - (currDist - tableWidth + tableHeight),
                tableY + tableHeight);

        } else {
            seat.avatarPos =
                new PIXI.Point(tableX, (tableY + tableHeight) - (currDist - tableWidth * 2 + tableHeight));
            seat.cardsPos = 
                new PIXI.Point(tableX, (tableY + tableHeight) - (currDist - tableWidth * 2 + tableHeight));
            seat.dealerPos = 
                new PIXI.Point(tableX, (tableY + tableHeight) - (currDist - tableWidth * 2 + tableHeight));
            seat.chipsPos = 
                new PIXI.Point(tableX, (tableY + tableHeight) - (currDist - tableWidth * 2 + tableHeight));
        }
        currDist += seatDist;
    }

    table.width = tableWidth;
    table.height = tableHeight;
    table.position.set(
        app.screen.width / 2 - table.width / 2,
        app.screen.height / 2 - table.height / 2);

    seats.forEach(seat => {
        console.log(seat.position)
        seat.position= seat.avatarPos;        
    });

    cards.forEach(card => {
        card.anchor.set(0.5);
        card.scale.set(0.3);
    });

    // chips.forEach(chip => {
    //     //
    // });

    room.addChild(background, table, ...seats, dealerSign);

    return room;
}

init();