import Assets from "./Assets";
import Ball, { ServingDirection } from "./Ball";
import Config from "./Config";
import Controller from "./Controller";
import HUD from "./HUD";
import Paddle, { PaddleActions } from "./Paddle";


/**
 * Use string literals for avoiding pointless memory allocation
 */
const _player1WinMessage: string = "Player 1\nhas won!";
const _player2WinMessage: string = "Player 2\nhas won!";

export class Arena extends Phaser.State 
{
	//Game Objects
	leftPaddle : Paddle;
	rightPaddle: Paddle;
	ball : Ball;

	//HUD
	hud : HUD;

	/**
	 * 
	 */
	leftPlayerScore : number = 0;
	rightPlayerScore: number = 0;
	winnerFound: boolean = false;

	private sfxBallHit : Phaser.Sound;
	private sfxScore   : Phaser.Sound;
	private sfxWin	   : Phaser.Sound;



	create() 
	{
		super.create(this.game);
		this.hud = new HUD(this.game);
		this.setupSFX();
		this.setupPlayers();
		this.setupControllers();
	}

	setupSFX() : void
	{
		this.sfxBallHit = this.game.add.audio(Assets.sfx.paddle);
		this.sfxScore   = this.game.add.audio(Assets.sfx.score);
		this.sfxWin		= this.game.add.audio(Assets.sfx.win);
		this.sfxWin.loop = false;
	}


	/**
	 * Creates the texture for each paddle, the ball and initialize them.
	 * Although this could be encapsulated, doing that way is more efficient as the texture
	 * will be shared.
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
		leftController.addBinding(PaddleActions.MoveUp, () => !this.winnerFound && this.input.keyboard.isDown(Phaser.KeyCode.W));
		leftController.addBinding(PaddleActions.MoveDown, () => !this.winnerFound && this.input.keyboard.isDown(Phaser.KeyCode.S));
		this.leftPaddle.setController(leftController);

		const rightController = Paddle.createPaddleController("Right Player");
		rightController.addBinding(PaddleActions.MoveUp, () => !this.winnerFound && this.input.keyboard.isDown(Phaser.KeyCode.UP));
		rightController.addBinding(PaddleActions.MoveDown, () => !this.winnerFound && this.input.keyboard.isDown(Phaser.KeyCode.DOWN));
		this.rightPaddle.setController(rightController);

		const ballController = Ball.createBallController("Ball");
		ballController.addBinding("Start", () => !this.winnerFound && this.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR));
		this.ball.setController(ballController);
	}

	checkPaddleBallCollision() : boolean
	{
		let anyHit: boolean = false;
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

	getWinner() : ServingDirection
	{
		if(this.rightPlayerScore >= 7)
			return ServingDirection.right;
		else if(this.leftPlayerScore >= 7)
			return ServingDirection.left;
		return ServingDirection.none;
	}

	winGame(winner: ServingDirection)
	{
		this.winnerFound = true;
		this.ball.visible = false;
		this.sfxWin.play();
		if(winner === ServingDirection.left)
		{
			this.hud.showWinMessage(_player1WinMessage);
		}
		else if(winner === ServingDirection.right)
		{
			this.hud.showWinMessage(_player2WinMessage);
		}
		else if(DEBUG)
		{
			throw new Error("Logic bug on winGame");
		}
		const restartTimer = new Phaser.Timer(this.game, true);
		restartTimer.add(Config.RESTART_TIME, () => {this.game.state.start("Arena")});
		this.game.time.add(restartTimer).start();
	}

	/**
	 * Implementation needed for restarting some logic
	 */
	shutdown(game: Phaser.Game) : void 
	{
		super.shutdown(game);
		this.leftPlayerScore = 0;
		this.rightPlayerScore = 0;
		this.winnerFound = false;
	}



	/**
	 * Check for left and right side out of boundaries
	 */
	checkScoreCondition() : void
	{
		if(this.winnerFound)
			return;
		const ball = this.ball;
		if(ball.x < 0)
        {
			this.hud.setRightScore(++this.rightPlayerScore);
            ball.restart(ServingDirection.left);
			this.sfxScore.play();
        }
        else if(ball.x + ball.width > Config.GAME_WIDTH)
        {
			this.hud.setLeftScore(++this.leftPlayerScore);
            ball.restart(ServingDirection.right);
			this.sfxScore.play();
        }

		const winner: ServingDirection = this.getWinner();
		if(winner != ServingDirection.none)
		{
			this.winGame(winner);
		}
	}


	update(game: Phaser.Game): void 
	{
		///Those need to be updated before the game preUpdate as they deal with physics
		this.checkPaddleBallCollision();
		this.checkScoreCondition();
		super.update(game);
	}

}