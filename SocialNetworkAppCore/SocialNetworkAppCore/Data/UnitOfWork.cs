using AutoMapper;
using SocialNetworkAppCore.Interfaces;
using SocialNetworkAppCore.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        DataContext _context;
        IMapper _mapper;

        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IUserRepository UserRepository => new UserRepository(_context, _mapper);
        public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper);
        public IPostRepository PostRepository => new PostRepository(_context, _mapper);
        public ICommentRepository CommentRepository => new CommentRepository(_context, _mapper);
        public IUserLikePostRepository UserLikePostRepository => new UserLikePostRepository(_context, _mapper);
        public INotificationRepository NotificationRepository => new NotificationRepository(_context, _mapper);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}
