using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAppCore.Data;
using SocialNetworkAppCore.DTOs;
using SocialNetworkAppCore.Entities;
using SocialNetworkAppCore.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public NotificationRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void Add(Notification model)
        {
            _context.Notifications.Add(model);
        }

        public async Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int userId)
        {
            return await _context.Notifications.Where(c => c.UserId == userId)
                .OrderByDescending(d=>d.DateCreated)
                .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();//using Microsoft.EntityFrameworkCore;
        }

        public async Task<NotificationDto> GetOneNotificationAsync(int id)
        {
            return await _context.Notifications.Where(x => x.Id == id).ProjectTo<NotificationDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }
    }
}
