import Assets from "./Assets";
import Config from "./Config";
import Controller from "./Controller";


export enum ServingDirection
{
    left = -1,
    none = 0,
    right = 1,
}

export default class Ball extends Phaser.Sprite
{

    static createBallController(name: string) : Controller<Ball>
    {
        const c = new Controller<Ball>(name);
		c.addAction("Start", (ball) => 
        {
            ball.start();
        });
        return c;
    }

    controller : Controller<Ball>;

    private startX : number;
    private startY : number;

    private servingDirection : ServingDirection = ServingDirection.none;
    private hasStarted : boolean = false;
    private sfxBallBoundary : Phaser.Sound;
    
    constructor(game: Phaser.Game, x: number, y: number, texture: PIXI.Texture, accelerationFactor: number)
    {
        super(game, x, y);
        this.setTexture(texture);

        this.startX = x;
        this.startY = y;
        this.width  = Config.BALL_SIZE;
        this.height = Config.BALL_SIZE;
        this.sfxBallBoundary = game.add.audio(Assets.sfx.ricochet);
        game.physics.arcade.enable(this);
        game.add.existing(this);
    }

    setController(controller: Controller<Ball>) : void
    {
        this.controller = controller;
        controller.setOwner(this);
    }

    start() : void
    {
        if(this.hasStarted)
            return;
        this.hasStarted = true;

        if(this.servingDirection == ServingDirection.none)
        {
            if(Math.random() > 0.5)
                this.servingDirection = ServingDirection.right;
            else
                this.servingDirection = ServingDirection.left;                
        }
        
        let sideMultiplier: number = 1; //Defaults to right
        if(this.servingDirection == ServingDirection.left)
            sideMultiplier = -1;

        this.body.velocity.x = Phaser.Math.random(Config.BALL_MIN_VEL_X, Config.BALL_MAX_VEL_X) * sideMultiplier;
        this.body.velocity.y = Phaser.Math.random(Config.BALL_MIN_VEL_Y, Config.BALL_MAX_VEL_Y) * (Math.random() > 0.5 ? -1 : 1);
    }

    restart(servingDirection : ServingDirection = ServingDirection.none)
    {
        this.hasStarted = false;
        this.servingDirection = servingDirection;
        this.x = this.startX;
        this.y = this.startY;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    /**
     * Invert the velocity if hitting on the world boundaries
     */
    protected checkGameBoundariesCollision()
    {        
        if(this.y < 0)
        {
            this.body.velocity.y*= -1;
            this.y = 0;
            this.onHit();
        }
        else if(this.y + this.height > Config.GAME_HEIGHT)
        {
            this.body.velocity.y*= -1;
            this.y = Config.GAME_HEIGHT - this.height;
            this.onHit();
        }
    }

    onHit()
    {
        this.body.velocity.multiply(Config.BALL_BOUNCE_SPEED_MULTIPLIER, Config.BALL_BOUNCE_SPEED_MULTIPLIER);
        this.sfxBallBoundary.play();
    }

    preUpdate(): void 
    {
        super.preUpdate();
        this.controller.poll();
    }
    postUpdate(): void 
    {
        super.postUpdate();
        this.checkGameBoundariesCollision();        
    }
}