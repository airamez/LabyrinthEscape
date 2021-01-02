import { Component, OnInit, HostListener } from '@angular/core';

import {Game, Cell, MoveDirection, MoveResult} from './Game';

@Component({
  selector: 'app-labyrinth',
  templateUrl: './labyrinth.component.html',
  styleUrls: ['./labyrinth.component.css']
})
export class LabyrinthComponent implements OnInit {

  public game?: Game;
  public size: number = 20;
  public Cell = Cell;
  public moveLog: string[] = [];
  public speaking: boolean = false;
  stepSound: HTMLAudioElement = new Audio("../assets/Step.mp3");

  constructor() {
  }

  ngOnInit(): void {
    this.newGame();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.game) {
      return;
    }
    if (this.speaking) {
      return;
    }
    let key: string = event.key;
    let move: MoveDirection = MoveDirection.Right;
    if (key === 'ArrowRight' || key.toUpperCase() === 'D' ||
        key === 'ArrowLeft' || key.toUpperCase() === 'A' ||
        key === 'ArrowUp' || key.toUpperCase() === 'W' ||
        key === 'ArrowDown' || key.toUpperCase() === 'S') {
        if (key === 'ArrowRight' || key.toUpperCase() === 'D') {
          move = MoveDirection.Right;
        } else if (key === 'ArrowLeft' || key.toUpperCase() === 'A') {
          move = MoveDirection.Left;
        } else if (key === 'ArrowUp' || key.toUpperCase() === 'W') {
          move = MoveDirection.Up;
        } else if (key === 'ArrowDown' || key.toUpperCase() === 'S') {
          move = MoveDirection.Down;
        }
        let result: MoveResult = this.game.move(move);
        this.moveLog.unshift(`${MoveDirection[move]}:${MoveResult[result]}`);
        if (result == MoveResult.Success) {
          this.walk();
        } else {
          this.SayAction(MoveResult[result]);
        }
    }
  }

  newGame() {
    this.SayAction("New Game");
    this.game = new Game(this.size);
    this.moveLog = [];
  }

  async walk() {
    this.speaking = true;
    this.stepSound.play();
    var _this = this;
    this.stepSound.onended = function() {
      _this.speaking = false;
    };
  }

  SayAction(message: string) {
    this.speaking = true;
    let audio = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(audio);
    var _this = this;
    audio.onend = function(event){
      _this.speaking = false;
    }
  }
}
