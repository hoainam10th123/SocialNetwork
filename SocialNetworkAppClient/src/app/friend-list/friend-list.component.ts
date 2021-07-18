import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { UserChatBox } from '../models/user-chatbox';
import { DataUnreadService } from '../services/data-unread.service';
import { PresenceService } from '../services/presence.service';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  chatBoxUsers: UserChatBox[] = [];
  usernameActived: string;

  constructor(private dataUnread:DataUnreadService, public presence: PresenceService, private soundService: SoundService) {
    this.presence.messageUsername$.subscribe(username => {
      this.unReadMessageFromSenderUsername(username);
    })
  }

  unReadMessageFromSenderUsername(senderUsername: Member) {
    this.presence.onlineUsers$.subscribe(usersOnline => {
      usersOnline.forEach(element => {
        let sum: number = 0;
        if (element.userName === senderUsername.userName) {          
          
          if(this.chatBoxUsers.length < 2){
            this.soundService.playAudioMessage();
            this.selectUser(senderUsername);//display chat-box
            sum += 1;            
          }else{
            if (senderUsername.userName !== this.usernameActived) {
              element.unReadMessageCount++;
              sum +=element.unReadMessageCount;
            }
          }
          if(!this.dataUnread.chatActive){
            this.dataUnread.countUnreadMessage = sum;
          }
        }        
      });
    })
  }

  

  ngOnInit(): void {
    const userChatBox: UserChatBox[] = JSON.parse(localStorage.getItem('chatboxusers'));
    if (userChatBox) {
      this.chatBoxUsers = userChatBox;
    } else {
      this.chatBoxUsers = [];
    }
  }

  clearUnreadMessage(userName: string){
    this.presence.onlineUsers$.subscribe(usersOnline => {
      let user = usersOnline.find(x=>x.userName === userName);
      if(user){
        user.unReadMessageCount = 0;
      }
    })
  }

  selectUser(user: Member) {
    this.clearUnreadMessage(user.userName);
    this.usernameActived = user.userName;
    switch (this.chatBoxUsers.length % 2) {
      case 2: {
        var u = this.chatBoxUsers.find(x => x.user.userName === user.userName);
        if (u != undefined) {
          this.chatBoxUsers = this.chatBoxUsers.filter(x => x.user.userName !== user.userName);
          this.chatBoxUsers.push(u);
        } else {
          this.chatBoxUsers.push(new UserChatBox(user, 250));
        }
        localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
        break;
      }
      case 1: {
        var u = this.chatBoxUsers.find(x => x.user.userName === user.userName);
        if (u != undefined) {
          this.chatBoxUsers = this.chatBoxUsers.filter(x => x.user.userName !== user.userName);
          this.chatBoxUsers.push(u);
        } else {
          this.chatBoxUsers.push(new UserChatBox(user, 250 + 325));
        }
        localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
        break;
      }
      default: {//0
        var u = this.chatBoxUsers.find(x => x.user.userName === user.userName);
        if (u != undefined) {
          this.chatBoxUsers = this.chatBoxUsers.filter(x => x.user.userName !== user.userName);
          this.chatBoxUsers.push(u);
        } else {
          this.chatBoxUsers.push(new UserChatBox(user, 250));
        }
        localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
        break;
      }
    }
  }

  removeChatBox(event: string) {
    this.chatBoxUsers = this.chatBoxUsers.filter(x => x.user.userName !== event);
    localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
  }

  activedChatBox(event: string){
    this.usernameActived = event;
    var u = this.chatBoxUsers.find(x => x.user.userName === event);
    if(u){
      this.chatBoxUsers = this.chatBoxUsers.filter(x => x.user.userName !== event);//remove
      this.chatBoxUsers.push(u);// add to end of array
      localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
    }    
  }

}
