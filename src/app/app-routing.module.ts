import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPageComponent } from './pages/user/user-page.component';
import { UsersPageComponent } from './pages/users/users-page.component';

const routes: Routes = [
  { path: '', component: UsersPageComponent },
  { path: 'user/:id', component: UserPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
