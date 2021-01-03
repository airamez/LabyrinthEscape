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
    NewCell,
    VisitedCell,
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
    private visitedCells: boolean[][] = [];
    public currentPosition: Position = new Position (0, 0);
    public size: number = 0;
    private labirinthStart: Position = new Position (0, 0);
    private labirinthExit: Position = new Position (0, 0);

    constructor(size: number) {
        this.size = size;
        this.initializeVisited();
        this.generate();
    }

    public generate() {
        for (let i = 0; i < this.size; i++) {
            this.labyrinth[i] = Array(this.size);
            for (let j = 0; j < this.size; j++) {
                var rnd = this.getRandom(2);
                if (rnd == 0) {
                    this.labyrinth[i][j] = Cell.Space;
                } else {
                    this.labyrinth[i][j] = Cell.Wall;
                }
            }
        }
        let corners: Position[] = [];
        for (let i = 0; i < this.size; i++) {
            corners.push(new Position(0, i));
            corners.push(new Position(this.size - 1, i));
        }
        for (let i = 1; i < this.size - 1; i++) {
            corners.push(new Position(i, this.size - 1));
            corners.push(new Position(i, 0));
        }
        this.labirinthStart = corners.splice(this.getRandom(corners.length), 1)[0];
        this.labirinthExit = corners[this.getRandom(corners.length)];
        this.labyrinth[this.labirinthStart.row][this.labirinthStart.column] = Cell.Start;
        this.currentPosition = new Position(this.labirinthStart.row, this.labirinthStart.column);
        this.visitedCells[this.labirinthStart.row][this.labirinthStart.column] = true;
        this.labyrinth[this.labirinthExit.row][this.labirinthExit.column] = Cell.Exit;
        this.guaranteSolution();
    }

    private guaranteSolution() {
        let current: Position = new Position(this.labirinthStart.row, this.labirinthStart.column);
        let visited: Position[] = [];
        let visitingCell: Position = this.getAdjacentPosition(current, visited);
        let exitFound : boolean = false;
        while (visitingCell.column != -1) {
            exitFound = visitingCell.row == this.labirinthExit.row &&
                        visitingCell.column == this.labirinthExit.column;
            if (exitFound) {
                break;
            }
            visited.push(visitingCell);
            visitingCell = this.getAdjacentPosition(visitingCell, visited);
        }
        if (!exitFound) {
            this.guaranteSolution();
        } else {
            visited.forEach(c => {
                this.labyrinth[c.row][c.column] = Cell.Space;
            });
        }
    }

    getAdjacentPosition(cell: Position, visited: Position[]) : Position {
        let candidateToAdjacents: Position[] = [];
        candidateToAdjacents.push(new Position(cell.row - 1, cell.column));
        candidateToAdjacents.push(new Position(cell.row + 1, cell.column));
        candidateToAdjacents.push(new Position(cell.row, cell.column - 1));
        candidateToAdjacents.push(new Position(cell.row, cell.column + 1));
        let adjacents: Position[] = [];
        for (let i = candidateToAdjacents.length - 1; i >= 0; i--) {
            let adjacent: Position = candidateToAdjacents[i];
            if (adjacent.row >= 0 && adjacent.column >= 0 &&
                adjacent.row < this.size && adjacent.column < this.size) {
                if (visited.findIndex(c => c.row == adjacent.row && c.column == adjacent.column) == -1) {
                    adjacents.push(adjacent);
                }
            }
        }
        if (adjacents.length == 0) {
            return new Position(-1, -1);
        } else {
            return adjacents[this.getRandom(adjacents.length)];
        }
    }

    private getRandom(range: number) : number {
       return Math.floor(Math.random() * Math.floor(range));
    }

    private initializeVisited() {
        for (let i = 0; i < this.size; i++) {
            this.visitedCells[i] = Array(this.size);
            for (let j = 0; j < this.size; j++) {
                this.visitedCells[i][j] = false;
            }
        }
    }

    public isCellVisited(row: number, column: number) {
        return this.visitedCells[row][column];
    }

    public move(key: MoveDirection) : MoveResult {
        let result: MoveResult = MoveResult.NewCell;
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
            if (!this.visitedCells[nextPosition.row][nextPosition.column]) {
                result = MoveResult.NewCell;
                this.visitedCells[nextPosition.row][nextPosition.column] = true;
            } else {
                result = MoveResult.VisitedCell;
            }
        }
        this.currentPosition = nextPosition;
        return result;
    }
}