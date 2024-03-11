import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    DialogAddPlayerComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game: Game;
  firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;
  unsub: any;
  constructor(public route: ActivatedRoute, public dialog: MatDialog) {
    this.game = new Game();
    const aCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(aCollection);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
    this.newGame();
    const gameId = params['id'];
    const gameDocRef = doc(this.firestore, 'games', gameId);
   
      console.log(params['id']);
      this.unsub = onSnapshot(gameDocRef, (gameDoc) => {
        if (params['id']) {
          this.games$.subscribe((game:any) => {
            console.log('game update', game);
            this.game.currentPlayer = game.currentPlayer;
            this.game.playedCards = game.playedCards;
            this.game.players = game.players;
            this.game.stack = game.stack;


          });
        }
      });
    });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      console.log('New card: ' + this.currentCard);
      console.log('Game is: ' + this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        if (this.currentCard != undefined) {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }
      }, 1000);
    }
  }

  newGame() {
    this.game = new Game();
    //console.log(this.game);
    //addDoc(collection(this.firestore, 'games'), this.game.toJson());
    //{
    //}
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {});

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
