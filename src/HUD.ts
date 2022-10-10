import Assets from "./Assets";
import Config from "./Config";

export default class HUD extends Phaser.Sprite
{
    centerLine : Phaser.Graphics;
	leftPaddleScoreDisplay : Phaser.BitmapText;
	rightPaddleScoreDisplay: Phaser.BitmapText;
	winMessageDisplay	   : Phaser.BitmapText;


    constructor(game: Phaser.Game)
    {
        super(game, 0, 0);
        this.create();
        game.add.existing(this);
    }

    /**
     * Setups the right and left paddle score display, the win display and the center dashed line
     */
    create() : void
    {
        this.centerLine = new Phaser.Graphics(this.game, 0, 0);
		this.centerLine.lineStyle(Config.DASHED_LINE_WIDTH, Config.DASHED_LINE_COLOR, 1.0);

		const lineX: number = Config.GAME_WIDTH/2;

		//Multiply by 2 for creating a spacing of the same height
		const dashedLineHeight = Config.GAME_HEIGHT / (Config.DASHED_LINE_COUNT * 2);

		for(let i = 0; i < Config.DASHED_LINE_COUNT; i++)
		{
			this.centerLine.moveTo(lineX, dashedLineHeight*i*2);
			this.centerLine.lineTo(lineX, dashedLineHeight*(i*2) + dashedLineHeight);
		}


		this.leftPaddleScoreDisplay = new Phaser.BitmapText(this.game, Config.SCORE_X, Config.SCORE_Y, Assets.bmFonts.pixelArt, "0", 64);
		this.rightPaddleScoreDisplay = new Phaser.BitmapText(this.game, Config.GAME_WIDTH - Config.SCORE_X, Config.SCORE_Y, Assets.bmFonts.pixelArt, "0", 64);
		this.winMessageDisplay = new Phaser.BitmapText(this.game, Config.GAME_WIDTH/2, Config.GAME_HEIGHT/2, Assets.bmFonts.pixelArt, "PLAYER 1\n HAS WON");
		this.winMessageDisplay.tint = Phaser.Color.GREEN;
		this.winMessageDisplay.x-= this.winMessageDisplay.width/2;


        this.addChild(this.centerLine); 
        this.addChild(this.leftPaddleScoreDisplay);
        this.addChild(this.rightPaddleScoreDisplay);
        this.addChild(this.winMessageDisplay);

        this.hideWinMessage();
    }

    /**
     * Sets the winner message and shows it
     * @param message 
     */
    showWinMessage(message: string) : void
    {
        this.winMessageDisplay.visible = true;
        this.winMessageDisplay.setText(message);
        this.game.world.bringToTop(this.winMessageDisplay);
    }

    hideWinMessage() : void
    {
        this.winMessageDisplay.visible = false;
    }


    /**
     * If the number is valid, it is returned, else, an error is thrown
     * @param num
     */
    private sanityCheckNumber(num: number) : number
    {
        if(!isFinite(num) || isNaN(num) || num < 0)
            throw new Error("Invalid number");
        return num;
    }

    setLeftScore(score: number) : void
    {
        if(DEBUG)
            score = this.sanityCheckNumber(score);
        this.leftPaddleScoreDisplay.setText(String(score));
    }
    setRightScore(score: number) : void
    {
        if(DEBUG)
            score = this.sanityCheckNumber(score);
        this.rightPaddleScoreDisplay.setText(String(score));
    }
}