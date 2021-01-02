import { Component, OnInit, HostListener } from '@angular/core';

import {Game, Cell, MoveDirection, MoveResult} from './Game';

@Component({
  selector: 'app-labyrinth',
  templateUrl: './labyrinth.component.html',
  styleUrls: ['./labyrinth.component.css']
})
export class LabyrinthComponent implements OnInit {

  public game: Game;
  public size: number = 20;
  public Cell = Cell;
  public moveLog: string[] = [];

  constructor() {
    this.game = new Game(this.size);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let key: string = event.key;
    let move: MoveDirection = MoveDirection.RIGHT;
    if (key === 'ArrowRight' || key.toUpperCase() === 'D' ||
        key === 'ArrowLeft' || key.toUpperCase() === 'A' ||
        key === 'ArrowUp' || key.toUpperCase() === 'W' ||
        key === 'ArrowDown' || key.toUpperCase() === 'S') {
        if (key === 'ArrowRight' || key.toUpperCase() === 'D') {
          move = MoveDirection.RIGHT;
        } else if (key === 'ArrowLeft' || key.toUpperCase() === 'A') {
          move = MoveDirection.LEFT;
        } else if (key === 'ArrowUp' || key.toUpperCase() === 'W') {
          move = MoveDirection.UP;
        } else if (key === 'ArrowDown' || key.toUpperCase() === 'S') {
          move = MoveDirection.DOWN;
        }
        let result: MoveResult = this.game.move(move);
        let resultText = MoveResult[result];
        this.moveLog.unshift(`${key}:${resultText}`);
    }
  }

  ngOnInit(): void {

  }

  newGame() {
    this.game = new Game(this.size);
    this.moveLog = [];
  }
}
