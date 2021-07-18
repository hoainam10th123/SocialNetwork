import { Member } from "./member";
import { User } from "./user";

export class UserChatBox{
    user: Member;
    right: number;//position

    constructor(_user, _right){
        this.user = _user;
        this.right = _right;
    }
}