
export default abstract class Assets
{
    ///Bitmap Fonts
    public static readonly bmFonts = 
    {
        pixelArt : "assets/ArcadeClassic"
    }

    /**
     * Sound Effects
     * Use wav as they are more performatic
     */
    public static readonly sfx = 
    {
        paddle : "assets/sounds/Paddle.wav",
        ricochet : "assets/sounds/Ricochet.wav",
        score : "assets/sounds/Score.wav",
        win : "assets/sounds/Win.wav"
    }
}