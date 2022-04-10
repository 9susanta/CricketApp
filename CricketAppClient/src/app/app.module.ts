import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatmoduleModule } from './matmodule/matmodule.module';


import { HttpClientModule } from '@angular/common/http';
import { TypeDropdownComponent } from './_ui_component/type-dropdown/type-dropdown.component';

import { TeamsComponent } from './_admin/teams/teams.component';
import { MenubarComponent } from './_ui_component/menubar/menubar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SeriesComponent } from './_admin/series/series.component';
import { PlayersComponent } from './_admin/players/players.component';
import { AddplayerComponent } from './_ui_component/addplayer/addplayer.component';
import { SquadComponent } from './_admin/squad/squad.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap/modal';  
import { AddMatchPlayersComponent } from './_admin/add-match-players/add-match-players.component';
import { StartMatchComponent } from './_admin/start-match/start-match.component';
import { PlayeruiComponent } from './_ui_component/playerui/playerui.component';
import { ScoreboardComponent } from './_admin/scoreboard/scoreboard.component';
import { SetplayerComponent } from './_ui_component/setplayer/setplayer.component';

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    TeamsComponent,
    TypeDropdownComponent,
    SeriesComponent,
    PlayersComponent,
    AddplayerComponent,
    SquadComponent,
    AddMatchPlayersComponent,
    StartMatchComponent,
    PlayeruiComponent,
    ScoreboardComponent,
    SetplayerComponent
  ],
  schemas: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatmoduleModule,
    HttpClientModule,
    FontAwesomeModule,
    TypeaheadModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
