using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.DTOs
{
    public class UserLikePostDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string UserPhotoUrl { get; set; }
        public int PostId { get; set; }
        public eLikeReaction LikeReaction { get; set; }
    }

    public enum eLikeReaction
    {
        anrgy = 0,
        haha = 1,
        like = 2,
        love = 3,
        sad = 4,
        wow = 5,
        yay = 6,
        none = 7
    }
}
