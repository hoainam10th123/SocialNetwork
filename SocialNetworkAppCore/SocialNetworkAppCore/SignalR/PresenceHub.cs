using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Extensions;
using SocialNetworkAppCore.Helpers;
using SocialNetworkAppCore.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        private readonly IUnitOfWork _unitOfWork;
        public PresenceHub(PresenceTracker tracker, IUnitOfWork unitOfWork)
        {
            _tracker = tracker;
            _unitOfWork = unitOfWork;
        }
        public override async Task OnConnectedAsync()
        {
            var username = Context.User.GetUsername();
            var isOnline = await _tracker.UserConnected(username, Context.ConnectionId);
            if (isOnline)
            {
                var user = await _unitOfWork.UserRepository.GetMemberAsync(username);
                await Clients.Others.SendAsync("UserIsOnline", user);
            } 

            var currentUsers = await _tracker.GetOnlineUsers();
            var usersOnline = await _unitOfWork.UserRepository.GetUsersOnlineAsync(username, currentUsers);
            await Clients.Caller.SendAsync("GetOnlineUsers", usersOnline);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.User.GetUsername();
            var isOffline = await _tracker.UserDisconnected(username, Context.ConnectionId);
            if (isOffline)
            {
                var user = await _unitOfWork.UserRepository.GetMemberAsync(username);
                await Clients.Others.SendAsync("UserIsOffline", user);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendPost(int postId)
        {            
            var post = await _unitOfWork.PostRepository.GetPostAsync(postId);
            await Clients.All.SendAsync("GetaPost", post);
        }

        public async Task GetComment(int commentId)
        {
            var comment = await _unitOfWork.CommentRepository.GetCommentAsync(commentId);
            await Clients.Caller.SendAsync("GetaComment", comment);
            await Clients.Others.SendAsync("GetaComment", comment);
        }

        public async Task SendReaction(int postId)
        {
            var comment = await _unitOfWork.UserLikePostRepository.GetReaction(postId, Context.User.GetUserId());
            await Clients.All.SendAsync("GetReaction", comment);
        }

        public async Task SendDelReaction(UserLikePostDto userLikePostDto)
        {            
            await Clients.Others.SendAsync("DelReaction", userLikePostDto);
        }

        //Tag user
        public async Task SendNotification(string[] usernames, string content)
        {
            foreach(var username in usernames)
            {
                var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
                var model = new Notification { Content = content, UserId = user.Id };
                _unitOfWork.NotificationRepository.Add(model);
                
                if(await _unitOfWork.Complete())
                {
                    var connections = await _tracker.GetConnectionsForUser(username);
                    if (connections != null)
                        await Clients.Clients(connections).SendAsync("Notification", null);
                }                
            }            
        }
    }
}
