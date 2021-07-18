using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public DateTime LastActive { get; set; } = DateTime.Now;
        public DateTime DayOfBirth { get; set; }
        public string DisplayName { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<UserLikePost> LikePosts { get; set; }//User like many posts
        public ICollection<Post> Posts { get; set; }
        public ICollection<Notification> Notifications { get; set; }
        public ICollection<Comment> Comments { get; set; }
    }
}
