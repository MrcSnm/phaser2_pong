import Assets from "./Assets";
import Ball from "./Ball";
import Config from "./Config";
import Controller from "./Controller";

export enum PaddleActions
{
	MoveDown = "Move Down",
	MoveUp = "Move Up"
}


let paddleCount : number = 0;

export default class Paddle extends Phaser.Sprite 
{

	static createPaddleController(name: string) : Controller<Paddle>
	{
		const c = new Controller<Paddle>(name);
		c.addAction(PaddleActions.MoveUp, (owner) =>
		{
			owner.movePaddleUp();
		});
		c.addAction(PaddleActions.MoveDown, (owner) =>
		{
			owner.movePaddleDown();
		});

		return c;
	}

	private controller : Controller<Paddle>;
	private count : number = 0;


	constructor(game: Phaser.Game, texture: PIXI.Texture, x: number, y: number) 
	{
		super(game, x, y, '');
		this.setTexture(texture);
		this.width = Config.PLAYER_WIDTH;
		this.height = Config.PLAYER_HEIGHT;
		this.count = ++paddleCount;
		this.smoothed = false;

		game.physics.arcade.enableBody(this);
		
		game.add.existing(this);
	}

	protected movePaddleUp()
	{
		this.body.velocity.y = -Config.PADDLE_VELOCITY;
	}
	protected movePaddleDown()
	{
		this.body.velocity.y = Config.PADDLE_VELOCITY;
	}

	/**
	 * Protect from going out of game boundaries
	 */
	protected handleInputArea() : void
	{
		if(this.y < 0)
		{
			this.y = 0;
			this.body.velocity.y = 0;
		}
		else if(this.y + this.height > Config.GAME_HEIGHT)
		{
			this.y = Config.GAME_HEIGHT - this.height
			this.body.velocity.y = 0;
		}
	}

	setController(controller: Controller<Paddle>) : void
	{
		this.controller = controller;
		this.controller.setOwner(this);
	}

	checkCollision(ball: Ball) : boolean
	{
		return this.game.physics.arcade.overlap(this, ball);
	}

	updateInput()
	{
		this.body.velocity.y = 0;
		if(this.controller)
			this.controller.poll();
		else if(DEBUG)
			console.error("No controller attached to paddle ", paddleCount);
	}

	update() 
	{
		this.updateInput();
	}
	postUpdate(): void 
	{
		super.postUpdate();
		this.handleInputArea();
	}

}