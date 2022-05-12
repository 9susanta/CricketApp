import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TypeDropdownComponent } from './_ui_component/type-dropdown/type-dropdown.component';

import { TeamsComponent } from './_admin/teams/teams.component';
import { MenubarComponent } from './_ui_component/menubar/menubar.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SeriesComponent } from './_admin/series/series.component';
import { PlayersComponent } from './_admin/players/players.component';
import { AddplayerComponent } from './_ui_component/addplayer/addplayer.component';
import { SquadComponent } from './_admin/squad/squad.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap/modal';  
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AddMatchPlayersComponent } from './_admin/add-match-players/add-match-players.component';
import { StartMatchComponent } from './_admin/start-match/start-match.component';
import { PlayeruiComponent } from './_ui_component/playerui/playerui.component';
import { ScoreboardComponent } from './_admin/scoreboard/scoreboard.component';
import { SetplayerComponent } from './_ui_component/setplayer/setplayer.component';
import { ScorecardComponent } from './clients/scorecard/scorecard.component';
import { MatchComponent } from './_admin/match/match.component';
import { PreventDoubleClickDirective } from './_directives/prevent-double-click.directive';
import { KeyStatsComponent } from './clients/key-stats/key-stats.component';
import { SharedModule } from './_module/shared.module';
import { ConfirmComponent } from './_modal/confirm/confirm.component';
import { LoadingInterceptor } from './_interceptor/loading.interceptor';
import { TeamtoseriesComponent } from './_admin/teamtoseries/teamtoseries.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

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
    SetplayerComponent,
    ScorecardComponent,
    MatchComponent,
    PreventDoubleClickDirective,
    KeyStatsComponent,
    ConfirmComponent,
    TeamtoseriesComponent
  ],
  schemas: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
