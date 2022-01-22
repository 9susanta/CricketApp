import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaginationModule,
    FontAwesomeModule
  ],
  exports:[ CommonModule,PaginationModule,FontAwesomeModule]
})
export class MatmoduleModule { }
