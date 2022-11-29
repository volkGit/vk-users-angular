import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';

import localeRu from '@angular/common/locales/ru'
registerLocaleData(localeRu)

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsersComponent } from './components/users/users.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UsersPageComponent } from './pages/users/users-page.component';
import { UserComponent } from './components/user/user.component';
import { UserPageComponent } from './pages/user/user-page.component';
import { NgbdModalContent } from './components/modals/modal.component';
import { TextHideComponent } from './components/textHide/textHide.component';
import { LinkPostComponent } from './components/linkPost/link-post.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    UsersComponent,
    LoaderComponent,
    UserComponent,
    NgbdModalContent,
    UsersPageComponent,
    UserPageComponent,
    TextHideComponent,
    LinkPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
