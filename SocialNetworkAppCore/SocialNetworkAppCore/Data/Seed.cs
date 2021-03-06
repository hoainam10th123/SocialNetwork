using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SocialNetworkAppCore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworkAppCore.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "admin"},
                new AppRole{Name = "user"}
            };

            if (!await roleManager.Roles.AnyAsync())
            {
                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }

            var users = new List<AppUser> {
                new AppUser { UserName = "hoainam10th", DisplayName = "Nguyễn Hoài Nam", DayOfBirth = DateTime.Parse("2/17/1991 12:15:12 PM")},
                new AppUser{ UserName="ubuntu", DisplayName = "Ubuntu Nguyễn", DayOfBirth = DateTime.Parse("2/17/1990 12:15:12 PM")},
                new AppUser{UserName="lisa", DisplayName = "Lisa", DayOfBirth = DateTime.Parse("2/17/2000 12:15:12 PM")}
            };

            foreach (var user in users)
            {
                //user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "Hoainam10th");
                await userManager.AddToRoleAsync(user, "user");
            }

            var admin = new AppUser { UserName = "admin", DisplayName = "Admin", DayOfBirth = DateTime.Parse("2/17/1991 12:15:12 PM") };
            await userManager.CreateAsync(admin, "Hoainam10th");
            await userManager.AddToRolesAsync(admin, new[] { "admin", "user" });
        }
    }
}
