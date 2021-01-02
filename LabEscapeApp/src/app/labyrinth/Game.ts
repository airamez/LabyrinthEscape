export enum Cell {
    Start = 'Start',
    Exit = 'Exit',
    Space = 'Space',
    Wall = 'Wall',
}

export enum MoveDirection {
    Right,
    Left,
    Up,
    Down
}

export enum MoveResult {
    Success,
    Exit,
    Wall
}

export class Position {
    public row : number = 0;
    public column : number = 0;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }
}

export class Game {
    public labyrinth: Cell[][] = [];
    public currentPosition: Position = new Position (0, 0);
    public size: number = 0;

    constructor(size: number) {
        this.size = size;
        this.generate();
    }

    public generate() {
        for (let i = 0; i < this.size; i++) {
            this.labyrinth[i] = Array(this.size);
            for (let j = 0; j < this.size; j++) {
                this.labyrinth[i][j] = Cell.Space;
                var rnd = Math.floor(Math.random() * Math.floor(10));
                if (rnd < 3) {
                    this.labyrinth[i][j] = Cell.Wall;
                }
            }
        }
        this.labyrinth[0][0] = Cell.Start;
        this.labyrinth[this.size - 1][this.size - 1] = Cell.Exit;
    }

    public move(key: MoveDirection) : MoveResult {
        let result: MoveResult = MoveResult.Success;
        let nextPosition: Position = new Position(this.currentPosition.row, this.currentPosition.column);
        if (key == MoveDirection.Up) {
            nextPosition.row--;
        } else if (key == MoveDirection.Down) {
            nextPosition.row++;
        } else if (key == MoveDirection.Left) {
            nextPosition.column--;
        } else if (key == MoveDirection.Right) {
            nextPosition.column++;
        }
        if (nextPosition.row < 0 || nextPosition.row >= this.size ||
            nextPosition.column < 0 || nextPosition.column >= this.size ||
            this.labyrinth[nextPosition.row][nextPosition.column] == Cell.Wall) {
            result = MoveResult.Wall;
            nextPosition = this.currentPosition;
        } else if (this.labyrinth[nextPosition.row][nextPosition.column] == Cell.Exit) {
            result = MoveResult.Exit;
        } else {
            result = MoveResult.Success;
        }
        this.currentPosition = nextPosition;
        return result;
    }
}