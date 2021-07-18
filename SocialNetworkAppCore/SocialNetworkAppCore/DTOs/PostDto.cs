using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string UserPhotoUrl { get; set; }
        public int UserId { get; set; }

        public ICollection<UserLikePostDto> PostLikeByUsers { get; set; } // A post has many user like
        public ICollection<PhotoOfPostDto> Photos { get; set; }
        public ICollection<CommentDto> Comments { get; set; }
    }
}
