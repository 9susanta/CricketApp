using CricketApp._helpers;
using CricketApp.Entity;
using CricketApp.Extensions;
using CricketApp.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public PlayersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("add-player")]
        public async Task<ActionResult> AddPlayer([FromBody] tblPlayers tblPlayers)
        {
            var result = await _unitOfWork.PlayersRepository.Create(tblPlayers);

            return Ok(result);
        }
        [HttpGet("get-player")]
        public async Task<ActionResult> GetPlayer([FromQuery] playerParam playerParam)
        {
            var teams = await _unitOfWork.PlayersRepository.GetPlayersList(playerParam);

            Response.AddPaginationHeader(teams.CurrentPage, teams.PageSize, teams.TotalCount, teams.TotalPages);

            return Ok(teams);
        }
        [HttpPut("update-player/{id}")]
        public async Task<ActionResult> EditPlayer(int id, [FromBody] tblPlayers tblPlayers)
        {
            var teams = await _unitOfWork.PlayersRepository.Update(id, tblPlayers);

            return Ok(teams);
        }

        [HttpDelete("delete-player")]
        public async Task<ActionResult> DeletePlayer([FromQuery] int id)
        {
            var teams = await _unitOfWork.PlayersRepository.Delete(id);

            return Ok(teams);
        }
    }
}
