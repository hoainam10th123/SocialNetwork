import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member, UserDetail } from '../models/member';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  loadUserFriends(){
    return this.http.get<Member[]>(this.baseUrl+'User');
  }

  getMember(username:string){
    return this.http.get<Member>(this.baseUrl+'user/' + username);
  }

  detailUser(username:string){
    return this.http.get<UserDetail>(this.baseUrl+'user/detail/' + username);
  }

  getMembers(pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<Member[]>(this.baseUrl+'user', params, this.http);
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'user/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'user/delete-photo/' + photoId);
  }

  searchMembers(displayName: string){
    return this.http.get<Member[]>(this.baseUrl + 'user/search-users/' + displayName);
  }
}
