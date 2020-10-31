import * as PIXI from "pixi.js";
import app from ".";
import Card from "./card";

export default class Seat extends PIXI.Container {
    constructor({
        id,
        side,
        position
    }) {
        super();

        this.id = id;
        this.side = side;
        this.player = null;
        this.position = position;
        this.tileset = app.loader.resources.tileset.textures;

        let ctx = new PIXI.Graphics();
        ctx.beginFill(0xffffff);
        ctx.drawRoundedRect(0, 0, 150, 50, 50);
        ctx.endFill();
        this.avatar = new PIXI.Sprite(app.renderer.generateTexture(ctx));

        // create dealer sign        
        this.dealerSign = new PIXI.Sprite(this.tileset["chipWhite_border.png"]);
        this.dealerSign.scale.set(0.3);
        this.dealerSign.visible = true;
        this.dealerSign.position.set(170, 20);

        // player cards
        this.playerCards = new PIXI.Container();
        this.cardOne = new Card({
            name: ""
        });
        this.cardOne.scale.set(0.45);
        this.cardOne.position.set(10, -50);
        this.cardOne.visible = false;
        this.cardTwo = new Card({
            name: ""
        });
        this.cardTwo.scale.set(0.45);
        this.cardTwo.position.set(75, -50);
        this.cardTwo.visible = false;
        this.playerCards.addChild(this.cardOne, this.cardTwo);

        // player info
        this.playerName = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 15,
            fill: 0x000000
        }));
        this.playerName.position.set(10, 20);

        this.playerBalance = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 15,
            fill: 0x000000
        }));
        this.playerBalance.position.set(100, 20);

        this.playerBets = new PIXI.Text("100K", new PIXI.TextStyle({
            fontSize: 15,
            fill: 0x000000
        }));
        this.playerBets.position.set(170, 0);

        this.addChild(
            this.playerCards,
            this.avatar,
            this.playerName,
            this.playerBets,
            this.playerBalance,
            this.dealerSign);
    }

    setPlayer(value) {
        this.player = value;
        this.playerName.text = this.player.name;
        this.playerBalance.text = this.player.balance;
    }

    showBalance(value) {
        this.playerBalance.text = value;
    }

    showBets(value) {
        this.playerBets.text = value;
    }

    showDealer() {
        this.dealerSign.visible = true;
    }
}