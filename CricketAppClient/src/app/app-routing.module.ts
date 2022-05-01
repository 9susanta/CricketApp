import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMatchPlayersComponent } from './_admin/add-match-players/add-match-players.component';
import { MatchComponent } from './_admin/match/match.component';
import { PlayersComponent } from './_admin/players/players.component';
import { ScoreboardComponent } from './_admin/scoreboard/scoreboard.component';
import { ScorecardComponent } from './_admin/scorecard/scorecard.component';
import { SeriesComponent } from './_admin/series/series.component';
import { SquadComponent } from './_admin/squad/squad.component';
import { TeamsComponent } from './_admin/teams/teams.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MatchComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'series', component: SeriesComponent },
  { path: 'squad', component:SquadComponent},
  { path: 'match', component:MatchComponent},
  { path: 'addmatchplayers/:id', component:AddMatchPlayersComponent},
  { path: 'scoreboard/:id', component:ScoreboardComponent},
  { path: 'scorecard/:id', component:ScorecardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
