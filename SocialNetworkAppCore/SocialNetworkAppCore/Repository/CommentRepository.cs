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
    public class CommentRepository : ICommentRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CommentRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddComment(Comment comment)
        {
            _context.Comments.Add(comment);
        }

        public async Task<CommentDto> DeleteComment(int cmtId)
        {
            var cmt = await _context.Comments.FindAsync(cmtId);
            if(cmt != null)
            {
                _context.Comments.Remove(cmt);
            }
            return _mapper.Map<CommentDto>(cmt);
        }

        public async Task<CommentDto> GetCommentAsync(int commentId)
        {
            return await _context.Comments.Where(c => c.Id == commentId)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();//using Microsoft.EntityFrameworkCore;
        }

        public async Task<Comment> GetCommentDbAsync(int parentId)
        {
            return await _context.Comments
                .Include(p => p.NestComments)
                .SingleOrDefaultAsync(c => c.Id == parentId);
        }

        public async Task<IEnumerable<CommentDto>> GetChildrenCommentAsync(int parentId)
        {
            return await _context.Comments.Where(c => c.ParentId == parentId)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<PagedList<CommentDto>> GetParentCommentAsync(CommentParams commentParams)
        {
            var parentComments = _context.Comments.Where(c => c.PostId == commentParams.PostId && c.ParentId == null);

            return await PagedList<CommentDto>.CreateAsync(parentComments.ProjectTo<CommentDto>(_mapper.ConfigurationProvider).AsNoTracking(), commentParams.PageNumber, commentParams.PageSize);
        }
    }
}
