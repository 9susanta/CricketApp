using CricketApp._helpers;
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
        public ActionResult GetMatchDetails(int? matchDetailsId)
        {
            if (matchDetailsId != null)
            {
                try
                {
                   return Ok(_unitOfWork.StartMatchRepository.getMatchTeamDetails(matchDetailsId.Value));
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
