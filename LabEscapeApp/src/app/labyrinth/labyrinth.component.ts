import { Component, OnInit, HostListener } from '@angular/core';

import {Game, Cell, MoveDirection, MoveResult} from './Game';

@Component({
  selector: 'app-labyrinth',
  templateUrl: './labyrinth.component.html',
  styleUrls: ['./labyrinth.component.css']
})
export class LabyrinthComponent implements OnInit {
  firstLoad: boolean = true;
  public game?: Game;
  public size: number = 20;
  public Cell = Cell;
  public moveLog: string[] = [];
  public playingSound: boolean = false;
  newCellStepSound: HTMLAudioElement = new Audio("../assets/FirstStep.mp3");
  visitedCellStepSound: HTMLAudioElement = new Audio("../assets/VisitedStep.mp3");
  wallSound: HTMLAudioElement = new Audio("../assets/Wall.mp3");

  constructor() {
  }

  ngOnInit(): void {
    this.newGame();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.firstLoad) {
      this.say("Welcome to labyrinth escape. Move using arrow keys or w, a, s or d keys");
      this.firstLoad = false;
      return;
    }
    if (!this.game) {
      return;
    }
    if (this.playingSound) {
      return;
    }
    let key: string = event.key.toLowerCase();
    let move: MoveDirection = MoveDirection.Right;
    if (key === 'arrowright' || key === 'd' ||
        key === 'arrowleft' || key === 'a' ||
        key === 'arrowup' || key === 'w' ||
        key === 'arrowdown' || key === 's') {
        if (key === 'arrowright' || key === 'd') {
          move = MoveDirection.Right;
        } else if (key === 'arrowleft' || key === 'a') {
          move = MoveDirection.Left;
        } else if (key === "arrowup" || key === 'w') {
          move = MoveDirection.Up;
        } else if (key === 'arrowdown' || key === 's') {
          move = MoveDirection.Down;
        }
        let result: MoveResult = this.game.move(move);
        this.moveLog.unshift(`${MoveDirection[move]} : ${MoveResult[result]}`);
        if (result == MoveResult.Exit) {
          this.say("Congratulations! You won");
          this.newGame();
        } else if (result == MoveResult.NewCell) {
          this.playSound(this.newCellStepSound);
        } else if (result == MoveResult.VisitedCell) {
          this.playSound(this.visitedCellStepSound);
        } else {
          this.playSound(this.wallSound);
        }
    }
  }

  newGame() {
    if (!this.firstLoad) {
      this.say("New Game");
    }
    this.game = new Game(this.size);
    this.moveLog = [];
  }

  playSound(sound: HTMLAudioElement) {
    this.playingSound = true;
    sound.play();
    var _this = this;
    sound.onended = function() {
      _this.playingSound = false;
    };
  }

  say(message: string) {
    this.playingSound = true;
    let audio = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(audio);
    var _this = this;
    audio.onend = function(event){
      _this.playingSound = false;
    }
  }
}
