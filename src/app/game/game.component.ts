import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog,} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import  {MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, DialogAddPlayerComponent,MatFormFieldModule,MatInputModule,FormsModule,MatDialogModule, GameInfoComponent ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string | undefined = "";  
  game: Game;

  constructor(public dialog: MatDialog){
    this.game = new Game();
    
  }

  ngOnInit(): void{
    this.newGame();
  }

  takeCard(){
    if(!this.pickCardAnimation){
    this.currentCard = this.game.stack.pop();
    this.pickCardAnimation = true;
    console.log('New card: ' + this.currentCard);
    console.log('Game is: ' + this.game);

    this.game.currentPlayer ++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;


    setTimeout(() =>{
      if (this.currentCard != undefined) {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }
    }, 1000);
  }
  }

  newGame(){
    this.game = new Game();
    console.log(this.game);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
    this.game.players.push(name);   
      } 
});
  }
}
