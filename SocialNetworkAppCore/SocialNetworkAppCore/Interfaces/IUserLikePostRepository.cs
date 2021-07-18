using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Interfaces
{
    public interface IUserLikePostRepository
    {
        Task AddReaction(UserLikePost userLikePost);
        Task<UserLikePostDto> GetReaction(int postId, int userId);
        Task DeleteReaction(int userId, int postId);
    }
}
