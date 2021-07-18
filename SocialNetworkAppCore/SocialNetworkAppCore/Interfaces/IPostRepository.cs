using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Interfaces
{
    public interface IPostRepository
    {
        void AddPost(Post post);
        Task<Post> DeletePost(int postId);
        void UpdatePost(Post post);
        Task<PagedList<PostDto>> GetAllPostByUserId(PostParams postParams);
        Task<PagedList<PostDto>> GetAllPost(PostParams postParams);
        Task<PostDto> GetPostAsync(int postId);
        Task<Post> GetPostdbAsync(int postId);
    }
}
