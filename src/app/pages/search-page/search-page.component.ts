import {Component, inject} from '@angular/core';
import {ProfileCardComponent} from "../../common-ui/profile-card/profile-card.component";
import {RouterOutlet} from "@angular/router";
import {Profile} from "../../data/interfaces/profile.interface";
import {ProfileService} from "../../data/services/profile.service";

@Component({
  selector: 'app-search-page',
  standalone: true,
    imports: [
        ProfileCardComponent,
        RouterOutlet
    ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  profiles: Profile[] = []

  profileService = inject(ProfileService)

  constructor() {
    this.profileService.getTestAccounts().subscribe(val =>
      this.profiles = val
    )
  }

}
