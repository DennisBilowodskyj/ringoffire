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
  updateDoc,
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
  game: Game;
  gameId: string | undefined;
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
      const gameId = params['id']; // Extrahiere die Spiel-ID aus dem `params` Objekt.
      const gameDocRef = doc(this.firestore, 'games', gameId); // Erstelle eine Referenz auf das Spiel-Dokument in Firestore
      // mit der angegebenen Spiel-ID.
      this.gameId = params['id'];
      console.log(params['id']);
      this.unsub = onSnapshot(gameDocRef, (gameDoc) => {
        // Abonniere den `onSnapshot` Observable von Firestore.
        // Dieser Observable emittet ein `DocumentSnapshot` Objekt
        // jedes Mal, wenn sich das Spiel-Dokument ändert.
        if (gameDoc.exists()) {
          // Prüfe, ob das Spiel-Dokument in Firestore existiert.
          const gameData = gameDoc.data(); // Extrahiere die Spieldaten aus dem `DocumentSnapshot` Objekt.
          console.log('game update', gameData);
          this.game.currentPlayer = gameData['currentPlayer']; // Weise den aktuellen Spieler aus den Spieldaten dem lokalen `game` Objekt zu.

          this.game.playedCards = gameData['playedCards']; // Weise die gespielten Karten aus den Spieldaten dem lokalen `game` Objekt zu.

          this.game.players = gameData['players']; // Weise die Spielerliste aus den Spieldaten dem lokalen `game` Objekt zu.

          this.game.stack = gameData['stack']; // Weise den Kartenstapel aus den Spieldaten dem lokalen `game` Objekt zu.
          this.game.pickCardAnimation = gameData['pickCardAnimation'];
          this.game.currentCard = gameData['currentCard'];
        }
      });
    });
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      console.log('New card: ' + this.game.currentCard);
      console.log('Game is: ' + this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
        this.saveGame();


      setTimeout(() => {
        if (this.game.currentCard != undefined) {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }
      }, 1000);
    }
  }

  newGame() {
    this.game = new Game();
    //console.log(this.game);
    //
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {});

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    if (!this.gameId) {
      console.error('Game ID is not defined.');
      return;
    }
    const gameDocRef = doc(this.firestore, 'games', this.gameId);
    updateDoc(gameDocRef, this.game.toJson());
  }
}
