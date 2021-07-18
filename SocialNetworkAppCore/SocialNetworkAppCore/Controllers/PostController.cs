using AutoMapper;
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
    public class PostController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public PostController(IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts([FromQuery] PostParams postParams)
        {
            var posts = await _unitOfWork.PostRepository.GetAllPost(postParams);
            Response.AddPaginationHeader(posts.CurrentPage, posts.PageSize, posts.TotalCount, posts.TotalPages);
            
            return Ok(posts);
        }

        [HttpGet("get-post-userid")]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetPostsByUserId([FromQuery] PostParams postParams)
        {
            postParams.UserId = User.GetUserId();

            var posts = await _unitOfWork.PostRepository.GetAllPostByUserId(postParams);
            Response.AddPaginationHeader(posts.CurrentPage, posts.PageSize, posts.TotalCount, posts.TotalPages);

            return Ok(posts);
        }

        [HttpGet("{postId}")]
        public async Task<ActionResult<PostDto>> GetPost(int postId)
        {
            var post = await _unitOfWork.PostRepository.GetPostAsync(postId);
            return Ok(post);
        }

        [HttpPost("{content}")]
        public async Task<ActionResult> AddPost(string content)
        {
            var post = new Post
            {
                UserId = User.GetUserId(),
                Content = content
            };

            _unitOfWork.PostRepository.AddPost(post);

            if (await _unitOfWork.Complete())
            {
                var postId = post.Id;                
                //add photos
                var formCollection = await Request.ReadFormAsync();
                var files = formCollection.Files;
                
                if(files.Count == 0)
                    return Ok(postId);

                var postdb = await _unitOfWork.PostRepository.GetPostdbAsync(postId);
                foreach (var file in files)
                {
                    var result = await _photoService.AddPhotoAsync(file);
                    if (result.Error != null)
                        return BadRequest(result.Error.Message);

                    var photo = new PhotoOfPost
                    {
                        Url = result.SecureUrl.AbsoluteUri,
                        PublicId = result.PublicId,
                        PostId = postId
                    };
                    postdb.Photos.Add(photo);
                }

                if (await _unitOfWork.Complete())
                    return Ok(postId);
            }
            return BadRequest("Problem adding post");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            var post = await _unitOfWork.PostRepository.DeletePost(id);

            if(await _unitOfWork.Complete())//xoa thanh cong thi xoa hinh tren cloud
            {
                foreach(var photo in post.Photos)
                {
                    if (photo.PublicId != null)
                    {
                        var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                        //if (result.Error != null) return BadRequest(result.Error.Message);
                    }
                }
                return Ok();
            }

            return BadRequest("Error while delete post");
        }

        [HttpPost("add-reaction")] // api/post/add-reaction?postId=1&reaction=2
        public async Task<ActionResult> AddReaction(int postId, eLikeReaction reaction)
        {
            var userLikePost = new UserLikePost { PostId = postId, UserId = User.GetUserId(), LikeReaction = reaction };

            await _unitOfWork.UserLikePostRepository.AddReaction(userLikePost);

            if(await _unitOfWork.Complete())
            {              
                return Ok();
            }
            return BadRequest("Error while add reaction!");
        }

        [HttpDelete] // api/post?postId=1
        public async Task<ActionResult> DeleteReaction(int postId)
        {            
            var userId = User.GetUserId();
            var o = await _unitOfWork.UserLikePostRepository.GetReaction(postId, userId);
            await _unitOfWork.UserLikePostRepository.DeleteReaction(userId, postId);
            if(await _unitOfWork.Complete())
            {                
                return Ok(o);
            }
            return BadRequest("Can not remove reaction!");
        }
    }
}
