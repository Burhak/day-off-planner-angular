export class ColorUtils {
  private constructor() { }

  public static randomColor(): string {
    return "#000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16) );
  }
}