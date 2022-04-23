using CricketApp._helpers;
using CricketApp.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StartMatchController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public StartMatchController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("start-match")]
        public async Task<ActionResult> UpdateMatch([FromBody] matchStartDto _matchStartDto)
        {
            if (_matchStartDto!=null)
            {
                try
                {
                   await _unitOfWork.StartMatchRepository.updateMatchTeamDetails(_matchStartDto);
                }
                catch (Exception ex)
                {
                    return BadRequest();
                }
            }
            return Ok();
        }
        [HttpGet("get-matchdetails")]
        public ActionResult GetMatchDetails(int? matchId)
        {
            if (matchId != null)
            {
                try
                {
                   var item = _unitOfWork.StartMatchRepository.getMatchTeamDetails(matchId.Value);
                   return Ok(JsonConvert.SerializeObject(item));
                }
                catch (Exception ex)
                {
                    return BadRequest();
                }
            }
            return Ok();
        }

    }
}
