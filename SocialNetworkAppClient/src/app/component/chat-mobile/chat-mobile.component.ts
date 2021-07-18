import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { MessageService } from 'src/app/services/message.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chat-mobile',
  templateUrl: './chat-mobile.component.html',
  styleUrls: ['./chat-mobile.component.css']
})
export class ChatMobileComponent implements OnInit, AfterViewChecked, OnDestroy {
  messageContent: string;
  @ViewChild('messageForm') messageForm: NgForm;
  userSelected: Member;
  userCurrent: User;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private dataUnread: DataUnreadService, public presence: PresenceService, public messageService: MessageService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.userCurrent = user);
  }

  ngOnInit(): void {
    this.presence.messageUsername$.subscribe(username => {
      this.unReadMessageFromSenderUsername(username);
    })
    this.dataUnread.chatActive = true;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { console.log(err); }
  }

  unReadMessageFromSenderUsername(senderUsername: Member) {
    this.presence.onlineUsers$.subscribe(usersOnline => {
      usersOnline.forEach(element => {
        if (element.userName === senderUsername.userName) {
          if (this.userSelected) {
            if (senderUsername.userName !== this.userSelected.userName) {
              element.unReadMessageCount++;
            }
          } else {
            element.unReadMessageCount++;
          }
        }
      });
    })
  }

  sendMessage() {
    if(this.userSelected){
      this.messageService.sendMessage(this.userSelected.userName, this.messageContent).then(() => {
        this.messageForm.reset();
      })
    }    
  }

  selectedUserAndLoadMessages(user: Member) {
    this.userSelected = user;
    this.clearUnreadMessage(user.userName);
    this.messageService.stopHubConnection();
    this.messageService.createHubConnection(this.userCurrent, this.userSelected.userName);
    this.scrollToBottom();
  }

  clearUnreadMessage(userName: string) {
    this.presence.onlineUsers$.subscribe(usersOnline => {
      let user = usersOnline.find(x => x.userName === userName);
      if (user) {
        user.unReadMessageCount = 0;
      }
    })
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    //console.log('chat mobile destroyed');
    this.messageService.stopHubConnection();
    this.dataUnread.chatActive = false;
  }
}
