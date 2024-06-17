import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Profile} from "../interfaces/profile.interface";
import {Pageble} from "../interfaces/pageble";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)   // зпросить у Ангуляра сущность inject

  BASE_URL = "https://icherniakov.ru/yt-course/"
  me = signal<Profile | null> (null)

  constructor() { }

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.BASE_URL}account/test_accounts`)  // generic запись
  }

  getMe() {
    return this.http.get<Profile>(`${this.BASE_URL}account/me`)
      .pipe(
        tap(res => this.me.set(res))
      )
  }

  getSubscribersShortList(subs_amount=3) {
    return this.http.get<Pageble<Profile>>(`${this.BASE_URL}account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0, subs_amount))
      )
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.BASE_URL}account/${id}`)
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${this.BASE_URL}account/me`, profile)
  }

  uploadAvatarPhoto(file: File) {
    const fd = new FormData()
    fd.append('image', file)
    return this.http.post<Profile>(`${this.BASE_URL}account/upload_image`, fd)
  }

}
