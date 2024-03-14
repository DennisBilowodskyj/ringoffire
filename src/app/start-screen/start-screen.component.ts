import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../../models/game';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  game: any;


  constructor(public firestore: Firestore, public router: Router){ }

  newGame() {
    //start game
    this.game = new Game();

    addDoc(collection(this.firestore, 'games'), this.game.toJson())
    .then((gameInfo: any) => {
        console.log(gameInfo);
        this.router.navigateByUrl(`/game/${gameInfo.id}`);

    });
  }
   
}
