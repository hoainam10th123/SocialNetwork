using SocialNetworkAppCore.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Entities
{
    public class UserLikePost
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; }
        public eLikeReaction LikeReaction { get; set; }
    }
}
