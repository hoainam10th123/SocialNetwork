import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {

    constructor(private userService: UserService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.userService.detailUser(route.paramMap.get('username'));
    }
}