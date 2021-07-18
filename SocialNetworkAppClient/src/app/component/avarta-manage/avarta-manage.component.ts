import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-avarta-manage',
  templateUrl: './avarta-manage.component.html',
  styleUrls: ['./avarta-manage.component.css']
})
export class AvartaManageComponent implements OnInit {
  member: Member;
  user: User;
  
  constructor(private userService: UserService, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user = user);
  }

  ngOnInit(): void {
    this.userService.getMember(this.user.userName).subscribe(member=>{
      this.member = member;
    })
  }

}
