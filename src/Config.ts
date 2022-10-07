
/**
 * Should not be instantiable
 */
export default abstract class Config
{

    ///Game config itself
    static readonly GAME_HEIGHT: number = 200;
    static readonly GAME_WIDTH : number = 400;
    static readonly START_Y_MULTIPLIER : number = 0.5;
    static readonly BALL_SIZE: number = 14;
    static readonly BALL_BOUNCE_SPEED_MULTIPLIER = 1.05;

    static readonly BALL_MIN_VEL_X = 100;
    static readonly BALL_MAX_VEL_X = 150;
    static readonly BALL_MIN_VEL_Y = 0;
    static readonly BALL_MAX_VEL_Y = 80;

    static readonly BALL_MIN_VELOCITY_START = 70;
    static readonly BALL_MAX_VELOCITY_START = 150;


    ///Player config
    static readonly PLAYER_WIDTH : number =  10;
    static readonly PLAYER_HEIGHT : number =  100;
    static readonly PLAYER_LEFT_X : number = 0;
    static readonly PLAYER_RIGHT_X : number = Config.GAME_WIDTH - Config.PLAYER_WIDTH;
    static readonly PADDLE_VELOCITY = 250;

    ///HUD Config
    static readonly SCORE_X : number = 100;
    static readonly SCORE_Y : number = 20;
    static readonly DASHED_LINE_COLOR: number = 0xaaaaaa;
    static readonly DASHED_LINE_WIDTH : number = 5;
    static readonly DASHED_LINE_COUNT : number = 25;
}