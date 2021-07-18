import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserLikePost } from 'src/app/models/user-like-post';

@Component({
  selector: 'app-load-like',
  templateUrl: './load-like.component.html',
  styleUrls: ['./load-like.component.css']
})
export class LoadLikeComponent implements OnInit {
  userLikePosts: UserLikePost[];
  
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

}
