import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMatchPlayersComponent } from './_admin/add-match-players/add-match-players.component';
import { PlayersComponent } from './_admin/players/players.component';
import { ScoreboardComponent } from './_admin/scoreboard/scoreboard.component';
import { SeriesComponent } from './_admin/series/series.component';
import { SquadComponent } from './_admin/squad/squad.component';
import { StartMatchComponent } from './_admin/start-match/start-match.component';
import { TeamsComponent } from './_admin/teams/teams.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'players', component: PlayersComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'series', component: SeriesComponent },
  { path: 'squad', component:SquadComponent},
  { path: 'addmatchplayers', component:AddMatchPlayersComponent},
  { path: 'scoreboard/:id', component:ScoreboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
