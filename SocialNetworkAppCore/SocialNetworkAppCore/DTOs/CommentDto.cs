using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string UserPhotoUrl { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
        public int? ParentId { get; set; }
        public int CountNestComment { get; set; } = 0;
        public ICollection<CommentDto> NestComments { get; set; }
    }
}
