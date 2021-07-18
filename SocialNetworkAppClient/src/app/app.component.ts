import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SocialNetworkAppClient';
  loading = false;
  constructor(private router: Router, public accountService: AccountService, private presence: PresenceService, private toastr: ToastrService) {
    this.createOnline$().subscribe(isOnline => this.showNotification(isOnline));  
  }

  ngOnInit(): void {
    this.loading = true;
    this.setCurrentUser();
  }

  showNotification(isOnline: boolean){
    if(this.loading){
      if(isOnline){
        this.toastr.success('Kết nối mạng thành công!');
      }else{
        this.toastr.error('Lỗi kết nối mạng!');
      }
    }    
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  setCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }else{
      this.router.navigateByUrl('login');
    }    
  }

}
