using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Entities
{
    public class Post
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;
        public AppUser AppUser { get; set; }
        public int UserId { get; set; }

        public ICollection<UserLikePost> PostLikeByUsers { get; set; } // A post has many user like
        public ICollection<PhotoOfPost> Photos { get; set; }
        public ICollection<Comment> Comments { get; set; }
    }
}
