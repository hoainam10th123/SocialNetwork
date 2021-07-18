using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string UserPhotoUrl { get; set; }
        public int UserId { get; set; }
    }
}
