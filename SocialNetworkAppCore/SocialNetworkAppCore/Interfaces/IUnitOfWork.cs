using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        IPostRepository PostRepository { get; }
        ICommentRepository CommentRepository { get; }
        IUserLikePostRepository UserLikePostRepository { get; }
        INotificationRepository NotificationRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
