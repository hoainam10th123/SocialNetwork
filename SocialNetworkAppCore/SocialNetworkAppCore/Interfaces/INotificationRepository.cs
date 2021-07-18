using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Interfaces
{
    public interface INotificationRepository
    {
        void Add(Notification model);
        Task<NotificationDto> GetOneNotificationAsync(int id);
        Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int userId);
    }
}
