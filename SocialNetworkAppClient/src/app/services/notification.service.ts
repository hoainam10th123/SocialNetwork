import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  addNotification(content: string, username: string){
    return this.http.post(this.baseUrl+'Notification?content='+content+'&username='+username, {});
  }

  getNotifications(){
    return this.http.get<Notification[]>(this.baseUrl+'Notification');
  }
}
