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

    /**
     * Generate the Lab
     */
    public generate() {
        // Set all cells randomly (50%) as Space or Wall
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
        this.setStartAndExit();
        this.labyrinth[this.labirinthStart.row][this.labirinthStart.column] = Cell.Start;
        this.currentPosition = new Position(this.labirinthStart.row, this.labirinthStart.column);
        this.visitedCells[this.labirinthStart.row][this.labirinthStart.column] = true;
        this.labyrinth[this.labirinthExit.row][this.labirinthExit.column] = Cell.Exit;
        this.forceSolution();
    }

    /**
     * Set the Start and Exit position randomly as one of the border position
     */
    setStartAndExit() {
        // List of all border positions
        let borderCells: Position[] = [];
        // Adding elements from horizontal border: first and last rows
        for (let i = 0; i < this.size; i++) {
            borderCells.push(new Position(0, i));
            borderCells.push(new Position(this.size - 1, i));
        }
        // Adding elements from verical border: fist and last columns
        // Skips the first and last elements as they were added already
        for (let i = 1; i < this.size - 1; i++) {
            borderCells.push(new Position(i, this.size - 1));
            borderCells.push(new Position(i, 0));
        }
        // Set the start and remove the position from the borderCells making sure exit
        // will be a different position
        this.labirinthStart = borderCells.splice(this.getRandom(borderCells.length), 1)[0];
        this.labirinthExit = borderCells[this.getRandom(borderCells.length)];
    }

    /**
     * Make sure there is at list one valid path from Start to Exit
     * The idea is to generate a random path from Start to Exit
     * and set the position as spaces
     */
    private forceSolution() {
        let current: Position = new Position(this.labirinthStart.row, this.labirinthStart.column);
        let solutionCells: Position[] = [];
        let visitingCell: Position = this.getAdjacentPosition(current, solutionCells);
        let exitFound : boolean = false;
        while (visitingCell.column != -1) {
            exitFound = this.isSamePosition(visitingCell, this.labirinthExit);
            if (exitFound) {
                break;
            }
            solutionCells.push(visitingCell);
            visitingCell = this.getAdjacentPosition(visitingCell, solutionCells);
        }
        if (!exitFound) {
            // No exit found, trying again
            this.forceSolution();
        } else {
            // Setting all cells from the possible solution as spaces
            solutionCells.forEach(c => {
                this.labyrinth[c.row][c.column] = Cell.Space;
            });
        }
    }

    isSamePosition(pos1: Position, pos2: Position) : boolean {
        return pos1.row == pos2.row &&
               pos1.column == pos2.column;
    }

    getAdjacents(cell: Position) : Position[] {
        let adjacents: Position[] = [];
        adjacents.push(new Position(cell.row - 1, cell.column));
        adjacents.push(new Position(cell.row + 1, cell.column));
        adjacents.push(new Position(cell.row, cell.column - 1));
        adjacents.push(new Position(cell.row, cell.column + 1));
        for (let i = adjacents.length - 1; i >= 0; i--) {
            let adjacent: Position = adjacents[i];
            if (adjacent.row < 0 || adjacent.column < 0 ||
                adjacent.row >= this.size || adjacent.column >= this.size)
            {
                adjacents.splice(i, 1);
            }
        }
        return adjacents;
    }

    getAdjacentPosition(cell: Position, visited: Position[]) : Position {
        let adjacents: Position[] = this.getAdjacents(cell);
        for (let i = adjacents.length - 1; i >= 0; i--) {
            if (this.existsInArray(visited, adjacents[i])) {
                adjacents.splice(i, 1);
            }
        }
        if (adjacents.length == 0) {
            return new Position(-1, -1);
        } else {
            return adjacents[this.getRandom(adjacents.length)];
        }
    }

    private existsInArray (array : Position[], position: Position) : boolean {
        return array.findIndex(c => c.row == position.row && c.column == position.column) != -1;
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