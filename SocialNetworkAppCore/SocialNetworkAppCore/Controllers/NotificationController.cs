using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Extensions;
using SocialNetworkAppCore.Interfaces;
using SocialNetworkAppCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Controllers
{
    [Authorize]
    public class NotificationController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        //private readonly IMapper _mapper;
        private IHubContext<PresenceHub> _presenceHub;
        PresenceTracker _presenceTracker;

        public NotificationController(IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub, PresenceTracker presenceTracker)
        {
            _unitOfWork = unitOfWork;
            //_mapper = mapper;
            _presenceHub = presenceHub;
            _presenceTracker = presenceTracker;
        }

        [HttpPost]
        public async Task<ActionResult> Add(string content, string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var model = new Notification { Content = content, UserId = user.Id };

            _unitOfWork.NotificationRepository.Add(model);

            if (await _unitOfWork.Complete())
            {
                var notifi = await _unitOfWork.NotificationRepository.GetOneNotificationAsync(model.Id);
                var connections = await _presenceTracker.GetConnectionsForUser(username);
                if(connections != null)
                    await _presenceHub.Clients.Clients(connections).SendAsync("Notification", notifi);
                return Ok();
            }

            return BadRequest("Problem adding notification");
        }

        [HttpGet]
        public async Task<ActionResult> GetNotifications()
        {
            var list = await _unitOfWork.NotificationRepository.GetNotificationsAsync(User.GetUserId());
            return Ok(list);
        }
    }
}
