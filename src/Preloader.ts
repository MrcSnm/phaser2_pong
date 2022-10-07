import Assets from "./Assets";

export class Preloader extends Phaser.State 
{

	preloadBar: Phaser.Sprite;
	background: Phaser.Sprite;

	preload() 
	{

		//	These are the assets we loaded in Boot.js
		this.preloadBar = this.add.sprite(300, 400, 'preloadBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.

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