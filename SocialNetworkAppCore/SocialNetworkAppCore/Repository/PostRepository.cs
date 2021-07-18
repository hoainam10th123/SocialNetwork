using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAppCore.Data;
using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Helpers;
using SocialNetworkAppCore.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public PostRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
       
        public async Task<PagedList<PostDto>> GetAllPostByUserId(PostParams postParams)
        {
            var posts = _context.Posts.Where(u => u.UserId == postParams.UserId)                
                .OrderByDescending(u => u.DatePosted);

            return await PagedList<PostDto>.CreateAsync(posts.ProjectTo<PostDto>(_mapper.ConfigurationProvider).AsNoTracking(), postParams.PageNumber, postParams.PageSize);
        }

        public async Task<PagedList<PostDto>> GetAllPost(PostParams postParams)
        {
            var posts = _context.Posts.OrderByDescending(u => u.DatePosted);

            return await PagedList<PostDto>.CreateAsync(posts.ProjectTo<PostDto>(_mapper.ConfigurationProvider).AsNoTracking(), postParams.PageNumber, postParams.PageSize);
        }

        public async Task<PostDto> GetPostAsync(int postId)
        {
            return await _context.Posts.Where(p => p.Id == postId)
                .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();//using Microsoft.EntityFrameworkCore;
        }

        public async Task<Post> GetPostdbAsync(int postId)
        {
            return await _context.Posts
                .Include(p => p.Photos)//get photo qua bang quan he xem cau hinh AutoMapperProfiles o Helpers
                .SingleOrDefaultAsync(x => x.Id == postId);
        }

        public void AddPost(Post post)
        {
            _context.Posts.Add(post);
        }

        public async Task<Post> DeletePost(int postId)
        {
            var post = await _context.Posts
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.Id == postId);

            if(post != null)
                _context.Posts.Remove(post);
            return post;
        }

        public void UpdatePost(Post post)
        {
            _context.Entry(post).State = EntityState.Modified;
        }
    }
}
