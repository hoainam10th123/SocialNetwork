using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Interfaces
{
    public interface ICommentRepository
    {
        void AddComment(Comment comment);
        Task<CommentDto> DeleteComment(int cmtId);
        Task<CommentDto> GetCommentAsync(int commentId);
        Task<Comment> GetCommentDbAsync(int parentId);
        Task<PagedList<CommentDto>> GetParentCommentAsync(CommentParams commentParams);
        Task<IEnumerable<CommentDto>> GetChildrenCommentAsync(int parentId);
    }
}
