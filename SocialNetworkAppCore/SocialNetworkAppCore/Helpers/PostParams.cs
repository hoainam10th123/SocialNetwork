using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Helpers
{
    public class PostParams : PaginationParams
    {
        public int UserId { get; set; }
    }

    public class CommentParams : PaginationParams
    {
        public int PostId { get; set; }
    }
}
