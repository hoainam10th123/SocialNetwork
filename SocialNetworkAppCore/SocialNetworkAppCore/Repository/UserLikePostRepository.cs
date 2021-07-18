using AutoMapper;
using AutoMapper.QueryableExtensions;
using SocialNetworkAppCore.Data;
using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Interfaces;
using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Repository
{
    public class UserLikePostRepository : IUserLikePostRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserLikePostRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AddReaction(UserLikePost userLikePost)
        {
            var userPost = await _context.UserPosts.FindAsync(userLikePost.UserId, userLikePost.PostId);
            if(userPost == null)//user chua like thi them vao db
            {
                _context.UserPosts.Add(userLikePost);
            }
            else//user like roi thi update
            {
                userPost.LikeReaction = userLikePost.LikeReaction;
            }
        }

        public async Task<UserLikePostDto> GetReaction(int postId, int userId)
        {
            var userPost = await _context.UserPosts.Where(up=>up.UserId == userId && up.PostId == postId)
                .ProjectTo<UserLikePostDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();//using Microsoft.EntityFrameworkCore;

            return userPost;
        }

        public async Task DeleteReaction(int userId, int postId)
        {
            var model = await _context.UserPosts.FirstOrDefaultAsync(x => x.UserId == userId && x.PostId == postId);
            if (model != null)
                _context.UserPosts.Remove(model);        
        }
    }
}
