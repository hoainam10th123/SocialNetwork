import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { User } from 'src/app/models/user';
import { take } from 'rxjs/operators';
import { PresenceService } from 'src/app/services/presence.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  selectedMenuItem: string;
  notifications: Notification[];
  userCurrent: User;
  countNotification: number = 0;

  constructor(private sound: SoundService, private presence: PresenceService, private notificationService: NotificationService, public dataUnread: DataUnreadService, public accountService: AccountService, private router: Router) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>{
      this.userCurrent = user;
    })
    this.presence.notification$.subscribe(notification=>{
      this.sound.playAudioNotification();
      this.countNotification += 1;
      localStorage.setItem('notification', JSON.stringify(this.countNotification));
    }) 
  }

  ngOnInit(): void {
    if(this.userCurrent){
      let notificationCount: number = JSON.parse(localStorage.getItem('notification'));
      this.countNotification = notificationCount;
    }    
  }

  loadNotifications(){
    this.countNotification = 0;
    localStorage.setItem('notification', JSON.stringify(this.countNotification));

    this.notificationService.getNotifications().subscribe(res=>{
      this.notifications = res;
    })
  }

  active(item: string){
    this.selectedMenuItem = item;
    if(this.selectedMenuItem === "chat"){
      this.dataUnread.countUnreadMessage = 0;
    }
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('login');
  }
}
