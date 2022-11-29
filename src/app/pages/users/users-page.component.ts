import { Component } from '@angular/core';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html'
})
export class UsersPageComponent {
  isLoading = false

  setLoad(value: boolean) {
    this.isLoading = value
  }
}
