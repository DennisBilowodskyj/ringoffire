import { Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';
import { PlayerComponent } from './player/player.component';

export const routes: Routes = [
    {path: '', component: StartScreenComponent},
    {path: 'game', component: GameComponent},
    {path: 'player', component: PlayerComponent},
   

];
