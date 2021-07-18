using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Entities
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;
        public AppUser AppUser { get; set; }
        public int UserId { get; set; }

        public ICollection<Comment> NestComments { get; set; }
        public Post Post { get; set; }
        public int PostId { get; set; }

        public Comment ParentComment { get; set; }
        public int? ParentId { get; set; }
    }
}
