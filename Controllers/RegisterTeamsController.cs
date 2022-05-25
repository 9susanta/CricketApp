using CricketApp._helpers;
using CricketApp.Entity;
using CricketApp.Enums;
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
    public class RegisterTeamsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public RegisterTeamsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("add-teams")]
        public async Task<ActionResult> AddTeams([FromBody]tblTeams tblTeams)
        {
            tblTeams.TeamTypes = new TypeList()._matchType.Where(x => x.Id == tblTeams.TeamTypeId.Value).FirstOrDefault().MatchType;
            var result= await _unitOfWork.TeamsRepository.Create(tblTeams);

            return Ok(result);
        }
        [HttpGet("get-teams")]
        public async Task<ActionResult> GetTeams([FromQuery] teamParam teamParam)
        {
            var teams= await _unitOfWork.TeamsRepository.GetTeamsList(teamParam);

            Response.AddPaginationHeader(teams.CurrentPage,teams.PageSize,teams.TotalCount,teams.TotalPages);

            return Ok(teams);
        }
        [HttpPut("update-teams/{id}")]
        public async Task<ActionResult> EditTeams(int id, [FromBody] tblTeams tblTeams)
        {
            tblTeams.TeamTypes = new TypeList()._matchType.Where(x => x.Id == tblTeams.TeamTypeId.Value).FirstOrDefault().MatchType;
            var teams = await _unitOfWork.TeamsRepository.Update(id, tblTeams);

            return Ok(teams);
        }

        [HttpDelete("delete-teams")]
        public async Task<ActionResult> DeleteTeams([FromQuery]int id)
        {
            var teams = await _unitOfWork.TeamsRepository.Delete(id);

            return Ok(teams);
        }
    }
}
