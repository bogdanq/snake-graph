export const CONSTANTS = {
  PAGE_WIDTH: 1200,
  PAGE_HEIGHT: 800,
  CELL_SIZE: 25,
  SNAKE_PADDING: 3,
  START_FOOD_COUNT: 50,
  FPS: 8,
  SNAKE_LENGT: 5,
  FUNNEL_LENGT: 5,

  BOT_START_COUNT: 1,

  getHorizontalCellCount: function () {
    return Math.floor(this.PAGE_WIDTH / this.CELL_SIZE);
  },
  getVerticalCellCount: function () {
    return Math.floor(this.PAGE_HEIGHT / this.CELL_SIZE);
  },

  getCellCount: function () {
    return this.getHorizontalCellCount() * this.getVerticalCellCount();
  },
};
