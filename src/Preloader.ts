import Assets from "./Assets";

export class Preloader extends Phaser.State 
{
	preload() 
	{

		this.load.bitmapFont(Assets.bmFonts.pixelArt);
		/**
		 * Load all audios
		 */
		for(const effect of Object.values(Assets.sfx))
		{
			this.load.audio(effect, effect, true);
		}
	}

	create() 
	{
		this.game.state.start('Arena');
	}
}