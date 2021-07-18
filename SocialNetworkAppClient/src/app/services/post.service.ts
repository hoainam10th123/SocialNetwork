import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { eLikeReaction } from '../models/ereaction';
import { Post } from '../models/post';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPosts(pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<Post[]>(this.baseUrl+'Post', params, this.http);
  }

  getPostByUserId(pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<Post[]>(this.baseUrl+'Post/get-post-userid', params, this.http);
  }

  addPost(content: string, formData: FormData){
    return this.http.post(this.baseUrl+'Post/'+content,formData);
  }

  deletePost(postId: number){
    return this.http.delete(this.baseUrl+'Post/'+postId);
  }

  addReaction(postId: number, reaction: eLikeReaction){
    return this.http.post(this.baseUrl+'Post/add-reaction?postId='+postId+'&reaction='+reaction, {});
  }

  deleteReaction(postId: number){
    return this.http.delete(this.baseUrl+'Post?postId='+postId);
  }

  updatePost(content: string){}
}
