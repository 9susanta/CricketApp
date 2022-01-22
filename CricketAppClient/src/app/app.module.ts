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

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    TeamsComponent,
    TypeDropdownComponent,
    SeriesComponent,
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
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
