﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace SocialNetworkAppCore.Migrations
{
    public partial class updatereactionuserlikepost : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LikeReaction",
                table: "UserPosts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikeReaction",
                table: "UserPosts");
        }
    }
}
