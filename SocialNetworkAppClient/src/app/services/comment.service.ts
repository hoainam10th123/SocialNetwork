import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addComment(postId: number, content: string){
    return this.http.post(this.baseUrl+'Comment?postId='+postId+'&content='+content, {});
  }

  getChildrenComment(parentId: number){
    return this.http.get<Comment[]>(this.baseUrl+'Comment/'+parentId);
  }

  deleteComment(commentId: number){
    return this.http.delete(this.baseUrl+'Comment/'+commentId);
  }

  addNestComment(postId: number, parentId: number, content: string){
    return this.http.post(this.baseUrl+'Comment/add-nest-comment?postId='+postId+'&parentId='+parentId+'&content='+content, {});
  }
}
