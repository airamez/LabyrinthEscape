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
  intro: string = "Welcome to labyrinth escape. You can move using arrow keys or w, a, s and d keys. Press space for new game.";

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostListener('window:mousedown', ['$event'])
  mouseDownEvent(event: MouseEvent) {
    console.log('mousedown');
    if (this.firstLoad) {
      this.firstLoad = false;
      this.say(this.intro)
        .then(() => {
          this.playingSound = false;
          this.newGame();
        });
    }
  }
 
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log('keyup');
    if (this.firstLoad) {
      this.firstLoad = false;
      this.say(this.intro)
        .then(() => {
          this.playingSound = false;
          this.newGame();
        });
      return;
    }
    if (!this.game) {
      return;
    }
    if (this.playingSound) {
      return;
    }
    let key: string = event.key.toLowerCase();
    if (key === ' ') {
      this.newGame();
      return;
    }
    let moveDirection: MoveDirection = MoveDirection.Right;
    if (key === 'arrowright' || key === 'd' ||
        key === 'arrowleft' || key === 'a' ||
        key === 'arrowup' || key === 'w' ||
        key === 'arrowdown' || key === 's') {
        if (key === 'arrowright' || key === 'd') {
          moveDirection = MoveDirection.Right;
        } else if (key === 'arrowleft' || key === 'a') {
          moveDirection = MoveDirection.Left;
        } else if (key === "arrowup" || key === 'w') {
          moveDirection = MoveDirection.Up;
        } else {
          moveDirection = MoveDirection.Down;
        }
        this.move(moveDirection);
    }
  }

  move(direction: MoveDirection) {
    if (this.game) {
      let result: MoveResult = this.game.move(direction);
      this.moveLog.unshift(`${MoveDirection[direction]} : ${MoveResult[result]}`);
      if (result == MoveResult.Exit) {
        this.say("Congratulations! You won")
        .then(() => {
          this.playingSound = false;
          this.newGame();
        });
      } else {
        let soundToPlay: HTMLAudioElement = this.wallSound;
        if (result == MoveResult.NewCell) {
          soundToPlay = this.newCellStepSound;
        } else if (result == MoveResult.VisitedCell) {
          soundToPlay = this.visitedCellStepSound;
        }
        this.playSound(soundToPlay)
        .then(() => {
          this.playingSound = false;
        });
      }
    }
  }

  newGame() {
    if (!this.firstLoad) {
      this.say("New Game")
      .then(() => {
        this.playingSound = false;
        this.game = new Game(this.size);
        this.moveLog = [];
      });
    }
  }

  playSound(sound: HTMLAudioElement) : Promise<any>{
    this.playingSound = true;
    return new Promise(function (resolve, reject) {
      sound.play();
      sound.onerror = reject;
      sound.onended = resolve;
    });
  }

  say(message: string) : Promise<any>{
    this.playingSound = true;
    return new Promise(function (resolve, reject) {
      let audio = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(audio);
      audio.onerror = reject;
      audio.onend = resolve;
    });
  }

  moveUp() {
    if (!this.playingSound) {
      this.move(MoveDirection.Up);
    }
  }

  moveLeft() {
    if (!this.playingSound) {
        this.move(MoveDirection.Left);
    }
  }

  moveRight() {
    if (!this.playingSound) {
      this.move(MoveDirection.Right);
    }
  }

  moveDown() {
    if (!this.playingSound) {
      this.move(MoveDirection.Down);
    }
  }
}
