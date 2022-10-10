export default class Boot extends Phaser.State 
{

	init() {
		//  Unless you specifically need to support multitouch I would recommend setting this to 1
		this.input.maxPointers = 1;

		//  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
		this.stage.disableVisibilityChange = true;

		// Enable physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

	}

	create() {
		//  By this point the preloader assets have loaded to the cache, we've set the game settings
		//  So now let's start the real preloader going
		this.game.state.start("Preloader");
	}
}
