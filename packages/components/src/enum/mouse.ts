export const enum MouseEventButton {
  /**
   * 主按键，通常指鼠标左键或默认值
   *
   * 如 document.getElementById('a').click() 这样触发就会是默认值
   * */
  'Main' = 0,
  /**
   * 鼠辅助按键，通常指鼠标滚轮中键
   * */
  'Aid' = 1,
  /**
   *  次按键，通常指鼠标右键
   * */
  'Sub' = 2,
  /**
   *  第四个按钮，通常指浏览器后退按钮
   * */
  'Back' = 3,
  /**
   *  第五个按钮，通常指浏览器的前进按钮
   * */
  'Go' = 4,
}
