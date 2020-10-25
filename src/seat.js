import * as PIXI from "pixi.js";
import app from ".";

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

        let ctx = new PIXI.Graphics();
        ctx.beginFill(0xffffff);
        ctx.drawCircle(0, 0, 50);
        ctx.endFill();
        this.avatar = new PIXI.Sprite(app.renderer.generateTexture(ctx));
        this.avatar.anchor.set(0.5);

        this.playerCards = new PIXI.Container();

        this.playerName = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 15,
            fill: 0x000000
        }));

        this.playerBalance = new PIXI.Text("", new PIXI.TextStyle({
            fontSize: 15,
            fill: 0x000000
        }));

        this.playerBets = new PIXI.Text("100K", new PIXI.TextStyle({
            fontSize: 15,
            fill: 0x000000
        }));

        switch (this.side) {
            case "left":
                this.playerCards.position = new PIXI.Point(this.x + 90, this.y);
                this.playerBets.position = new PIXI.Point(90, -60);
                break;
            case "right":
                this.playerCards.position = new PIXI.Point(this.x - 110, this.y);
                this.playerBets.position = new PIXI.Point(-90, -60);
                break;
            case "top":
                this.playerCards.position = new PIXI.Point(this.x, this.y + 90);
                this.playerBets.position = new PIXI.Point(60, 80);
                break;
            case "bot":
                this.playerCards.position = new PIXI.Point(this.x, this.y - 90);
                this.playerBets.position = new PIXI.Point(-60, -80);
                break;
            default:
                break;
        }

        this.addChild(
            this.avatar,
            this.playerName,
            this.playerBets,
            this.playerCards,
            this.playerBalance);
    }

    setPlayer(value) {
        this.player = value;
        this.playerName.text = this.player.name;
        this.playerName.position.set(
            -this.playerName.width / 2, -this.playerName.height / 2);

        this.playerBalance.text = this.player.balance;
        this.playerBalance.position.set(
            -this.playerBalance.width / 2, -this.playerBalance.height / 2 + 30);
    }

    setBalance(value) {
        this.playerBalance.text = value;
    }

    setBet(value) {
        this.playerBets.text = value;
    }
}