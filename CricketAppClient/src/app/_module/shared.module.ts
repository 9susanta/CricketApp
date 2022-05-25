import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ToastrModule} from 'ngx-toastr';
import {NgxSpinnerModule} from 'ngx-spinner';
import { faBaseballBall, faCalendarCheck, faCalendarDays, faCalendarMinus, faCalendarPlus, faCircleMinus, faCirclePlus, faClock, faGlobeAmericas, faHouse, faLocationDot, faLock, faLockOpen, faPenToSquare, faPeopleGroup, faPlugCircleMinus, faPlugCirclePlus, faPlus, faSort, faTrash, faTrophy, faUser, faUserAlt, faUsers } from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaginationModule,
    FontAwesomeModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right'
    }),
    NgxSpinnerModule
  ],
  exports:[ CommonModule,PaginationModule,FontAwesomeModule,ToastrModule,NgxSpinnerModule]
})
export class SharedModule { 
  constructor(library:FaIconLibrary) {
    library.addIcons(faPenToSquare,faTrash,faTrophy,faLocationDot,faSort,faCalendarDays,faCalendarCheck,
      faPeopleGroup,faHouse,faGlobeAmericas,faCalendarPlus,faCalendarMinus,faUser,faUserAlt,faLockOpen,faLock,faBaseballBall,faUsers,
      faCircleMinus,faCirclePlus,faPlus,faBaseballBall,faClock);
  }
}
