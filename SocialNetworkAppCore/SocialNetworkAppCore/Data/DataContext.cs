using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAppCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<PhotoOfPost> PhotoOfPosts { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<UserLikePost> UserPosts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Photo>()
                .HasOne(p => p.AppUser)
                .WithMany(u => u.Photos)
                .HasForeignKey(p => p.AppUserId);

            //Quan hệ bảng comment 1-n, 1 comment cha sẽ có nhiều comment con
            builder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(m => m.NestComments)
                .HasForeignKey(p => p.ParentId);

            // #Start User relesionship
            builder.Entity<UserLikePost>().HasKey(up => new { up.UserId, up.PostId });//Bảng trung gian của AppUser và Post

            //Quan hệ bảng UserLikePost và bảng AppUser
            builder.Entity<UserLikePost>()
                .HasOne(p => p.User)
                .WithMany(u => u.LikePosts)
                .HasForeignKey(p => p.UserId)
                .IsRequired();

            //Quan hệ bảng UserLikePost và bảng Post
            builder.Entity<UserLikePost>()
                .HasOne(p => p.Post)
                .WithMany(u => u.PostLikeByUsers)
                .HasForeignKey(p => p.PostId)
                .IsRequired();
            //1 user like nhiều post ngược lại 1 post có nhiều user like. 

            // 1 user có nhiều comment. 1-n
            builder.Entity<Comment>()
                .HasOne(p => p.AppUser)
                .WithMany(u => u.Comments)
                .HasForeignKey(p => p.UserId);

            //Quan hệ 1-n, bảng Post và AppUser
            builder.Entity<Post>()
                .HasOne(p => p.AppUser)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId);

            //Quan hệ 1-n, bảng Notification và AppUser
            builder.Entity<Notification>()
                .HasOne(p => p.AppUser)
                .WithMany(u => u.Notifications)
                .HasForeignKey(p => p.UserId);
            //Đây là hết quan hệ của  bảng User bắt đầu từ vị trí. #Start User

            //#Start Quan hệ của Post, comment, PhotoOfComment
            builder.Entity<Comment>()
                .HasOne(p => p.Post)
                .WithMany(u => u.Comments)
                .HasForeignKey(p => p.PostId);

            builder.Entity<PhotoOfPost>()
                .HasOne(p => p.Post)
                .WithMany(u => u.Photos)
                .HasForeignKey(p => p.PostId);           
        }
    }
}
