import Config from "./Config";
import Controller from "./Controller";

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
    private hasStarted : boolean = false;
    
    constructor(game: Phaser.Game, x: number, y: number, texture: PIXI.Texture, accelerationFactor: number)
    {
        super(game, x, y);

        this.setTexture(texture);
        this.width  = Config.BALL_SIZE;
        this.height = Config.BALL_SIZE;
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
        const vel: number = Phaser.Math.random(Config.BALL_MIN_VELOCITY_START, Config.BALL_MAX_VELOCITY_START);
        const angle: radian = Phaser.Math.degToRad(Phaser.Math.random(Config.BALL_MIN_ANGLE, Config.BALL_MAX_ANGLE));

        this.body.velocity.x = vel * Math.cos(angle);
        this.body.velocity.y = vel * Math.sin(angle);
        
    }

    /**
     * Invert the velocity if hitting on the world boundaries
     */
    protected checkGameBoundariesCollision()
    {
        if(this.x < 0)
        {
            this.body.velocity.x*= -1;
            this.x = 0;
        }
        else if(this.x + this.width > Config.GAME_WIDTH)
        {
            this.body.velocity.x*= -1;
            this.x = Config.GAME_WIDTH - this.width;
        }
        
        if(this.y < 0)
        {
            this.body.velocity.y*= -1;
            this.y = 0;
        }
        else if(this.y + this.height > Config.GAME_HEIGHT)
        {
            this.body.velocity.y*= -1;
            this.y = Config.GAME_HEIGHT - this.height;
        }
    }

    onHit()
    {
        const lastX = this.body.velocity.x;
        this.body.velocity.x = this.body.velocity.y;
        this.body.velocity.y = -lastX;
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