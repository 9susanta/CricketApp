using CricketApp.Entity;
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
        [HttpPost("AddTeams")]
        public async Task<ActionResult> AddTeams([FromBody]tblTeams tblTeams)
        {
            await _unitOfWork.TeamsRepository.Create(tblTeams);

            return Ok();
        }
        [HttpGet]
        public async Task<ActionResult> GetTeams()
        {
            var teams=await _unitOfWork.TeamsRepository.GetTeamTypesList();

            return Ok(teams);
        }
    }
}
