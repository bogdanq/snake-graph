export const CONSTANTS = {
  PAGE_WIDTH: 3000,
  PAGE_HEIGHT: 3000,
  CELL_SIZE: 25,
  SNAKE_PADDING: 3,
  START_FOOD_COUNT: 100,
  FPS: 8,
  SNAKE_LENGT: 30,
  FUNNEL_LENGT: 5,

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
