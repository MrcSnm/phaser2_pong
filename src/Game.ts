import { Arena } from "./Arena";
import Boot from "./Boot";
import Config from "./Config";
import { MainMenu } from "./MainMenu";
import { Preloader } from "./Preloader";

export default class Game extends Phaser.Game 
{
	constructor() 
	{
		super(
		{
			width: Config.GAME_WIDTH,
			height: Config.GAME_HEIGHT,
			renderer: Phaser.AUTO,
			canvasId: 'content',
			antialias: false,
			crisp: true
			
		});
		this.state.add('Boot', Boot, false);
		this.state.add('Preloader', Preloader, false);
		this.state.add('MainMenu', MainMenu, false);
		this.state.add('Arena', Arena, false);

		this.state.start('Boot');
	}

	boot(): void 
	{
		super.boot();
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//Remove scroll 
		window.addEventListener("keydown", (ev) =>
		{
			switch(ev.key)
			{
				case "ArrowDown":
				case "ArrowUp":
				case " ":
					ev.preventDefault();
				default:break;
			}
		});

	}
	

}