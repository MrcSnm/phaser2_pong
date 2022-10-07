import Assets from "./Assets";
import Ball, { ServingDirection } from "./Ball";
import Config from "./Config";
import Controller from "./Controller";
import Paddle, { PaddleActions } from "./Paddle";

export class Arena extends Phaser.State 
{
	//Game Objects
	leftPaddle : Paddle;
	rightPaddle: Paddle;
	ball : Ball;

	//HUD
	centerLine : Phaser.Graphics;
	leftPaddleScoreDisplay : Phaser.BitmapText;
	rightPaddleScoreDisplay: Phaser.BitmapText;
	leftPlayerScore : number = 0;
	rightPlayerScore: number = 0;

	private sfxBallHit : Phaser.Sound;
	private sfxScore   : Phaser.Sound;
	private sfxWin	   : Phaser.Sound;



	create() 
	{
		this.setupSFX();
		this.setupArenaHUD();
		this.setupPlayers();
		this.setupControllers();
	}

	setupSFX() : void
	{
		this.sfxBallHit = this.game.add.audio(Assets.sfx.paddle);
		this.sfxScore   = this.game.add.audio(Assets.sfx.score);
		this.sfxWin		= this.game.add.audio(Assets.sfx.win);
	}

	setupArenaHUD() : void
	{
		this.centerLine = this.add.graphics(0, 0);
		this.centerLine.lineStyle(Config.DASHED_LINE_WIDTH, Config.DASHED_LINE_COLOR, 1.0);

		const lineX: number = Config.GAME_WIDTH/2;

		//Multiply by 2 for creating a spacing of the same height
		const dashedLineHeight = Config.GAME_HEIGHT / (Config.DASHED_LINE_COUNT * 2);

		for(let i = 0; i < Config.DASHED_LINE_COUNT; i++)
		{
			this.centerLine.moveTo(lineX, dashedLineHeight*i*2);
			this.centerLine.lineTo(lineX, dashedLineHeight*(i*2) + dashedLineHeight);
		}

		this.leftPaddleScoreDisplay = this.add.bitmapText(Config.SCORE_X, Config.SCORE_Y, Assets.bmFonts.pixelArt, "0", 64);
		this.rightPaddleScoreDisplay = this.add.bitmapText(Config.GAME_WIDTH - Config.SCORE_X, Config.SCORE_Y, Assets.bmFonts.pixelArt, "0", 64);
	}

	/**
	 * Creates the texture for each paddle, the ball and initialize them
	 */
	setupPlayers() : void
	{
		const graphics = this.game.add.graphics(0,0);
		graphics.beginFill(0xffffff, 0xff);
		graphics.drawRect(0, 0, 1, 1);
		graphics.endFill();
		const texture = graphics.generateTexture();

		const startY = Config.GAME_HEIGHT / 2 - Config.PLAYER_HEIGHT/2;
		this.leftPaddle = new Paddle(this.game, texture, Config.PLAYER_LEFT_X, startY);
		this.rightPaddle = new Paddle(this.game, texture, Config.PLAYER_RIGHT_X, startY);
		graphics.clear();


		graphics.beginFill(0xffffff, 0xff);
		graphics.drawCircle(0, 0, Config.BALL_SIZE);
		this.ball = new Ball(this.game, Config.GAME_WIDTH/2 - Config.BALL_SIZE/2, Config.GAME_HEIGHT/2, graphics.generateTexture(), Config.BALL_BOUNCE_SPEED_MULTIPLIER);
		graphics.destroy();
	}

	/**
	 * Create the controllers, add the bindings and assign to their owners
	 */
	setupControllers() : void
	{
		const leftController = Paddle.createPaddleController("Left Player");
		leftController.addBinding(PaddleActions.MoveUp, () => this.input.keyboard.isDown(Phaser.KeyCode.W));
		leftController.addBinding(PaddleActions.MoveDown, () => this.input.keyboard.isDown(Phaser.KeyCode.S));
		this.leftPaddle.setController(leftController);


		const rightController = Paddle.createPaddleController("Right Player");
		rightController.addBinding(PaddleActions.MoveUp, () => this.input.keyboard.isDown(Phaser.KeyCode.UP));
		rightController.addBinding(PaddleActions.MoveDown, () => this.input.keyboard.isDown(Phaser.KeyCode.DOWN));
		this.rightPaddle.setController(rightController);

		const ballController = Ball.createBallController("Ball");
		ballController.addBinding("Start", () => this.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR));
		this.ball.setController(ballController);
	}

	checkPaddleBallCollision() : boolean
	{
		let anyHit: boolean = false;
		console.log(this.rightPaddle.x);
		if(anyHit = this.leftPaddle.checkCollision(this.ball))
		{
			this.ball.x = this.leftPaddle.x + this.leftPaddle.width + 1;
		}
		else if(anyHit = this.rightPaddle.checkCollision(this.ball))
		{
			this.ball.x = this.rightPaddle.x - this.ball.width - 1;
		}

		if(anyHit)
		{
			this.sfxBallHit.play();
			this.ball.body.velocity.x*= -1;
			this.ball.onHit();
		}
		return anyHit;
	}

	/**
	 * Check for left and right side out of boundaries
	 */
	checkScoreCondition() : void
	{
		const ball = this.ball;
		if(ball.x < 0)
        {
			this.rightPaddleScoreDisplay.setText(String(++this.rightPlayerScore));
            ball.restart(ServingDirection.left);
			this.sfxScore.play();
        }
        else if(ball.x + ball.width > Config.GAME_WIDTH)
        {
			this.leftPaddleScoreDisplay.setText(String(++this.leftPlayerScore));
            ball.restart(ServingDirection.right);
			this.sfxScore.play();
        }
	}

	update(game: Phaser.Game): void 
	{
		this.checkPaddleBallCollision();
		this.checkScoreCondition();
		super.update(game);
	}

}