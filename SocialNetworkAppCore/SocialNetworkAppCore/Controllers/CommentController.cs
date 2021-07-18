using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Extensions;
using SocialNetworkAppCore.Helpers;
using SocialNetworkAppCore.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Controllers
{
    [Authorize]
    public class CommentController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        //private readonly IMapper _mapper;

        public CommentController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            //_mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult> AddComment(int postId, string content)
        {
            var post = await _unitOfWork.PostRepository.GetPostdbAsync(postId);

            if(post == null)
                return BadRequest("Bài viết đã bị xóa hoặc không tồn tại!");

            var comment = new Comment { Content = content, PostId = postId, UserId = User.GetUserId() };
            _unitOfWork.CommentRepository.AddComment(comment);

            if (await _unitOfWork.Complete())
                return Ok(comment.Id);

            return BadRequest("Problem adding comment");
        }

        [HttpPost("add-nest-comment")]
        public async Task<ActionResult> AddNestComment(int postId, int parentId, string content)
        {
            var post = await _unitOfWork.PostRepository.GetPostdbAsync(postId);

            if (post == null)
                return BadRequest("Bài viết đã bị xóa hoặc không tồn tại!");

            var parentComment = await _unitOfWork.CommentRepository.GetCommentDbAsync(parentId);
            
            if(parentComment == null)
                return BadRequest("Bình luận cha đã bị xóa hoặc không tồn tại!");

            var nestComment = new Comment { ParentId = parentId, Content = content, PostId = postId, UserId = User.GetUserId() };
            
            parentComment.NestComments.Add(nestComment);

            if (await _unitOfWork.Complete())
            {
                var modelCmt = await _unitOfWork.CommentRepository.GetCommentAsync(nestComment.Id);
                return Ok(modelCmt);
            }

            return BadRequest("Problem adding nest comment");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var comment = await _unitOfWork.CommentRepository.DeleteComment(id);

            if (await _unitOfWork.Complete())
                return Ok(comment);

            return BadRequest("Problem delete comment");
        }

        [HttpGet("{parentId}")]
        public async Task<ActionResult> GetChildrenComment(int parentId)
        {
            var listChildren = await _unitOfWork.CommentRepository.GetChildrenCommentAsync(parentId);
            return Ok(listChildren);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments([FromQuery] CommentParams commentParams)
        {
            var comments = await _unitOfWork.CommentRepository.GetParentCommentAsync(commentParams);
            Response.AddPaginationHeader(comments.CurrentPage, comments.PageSize, comments.TotalCount, comments.TotalPages);

            return Ok(comments);
        }
    }
}
