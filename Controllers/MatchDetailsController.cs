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
    public class MatchDetailsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public MatchDetailsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("update-match-details")]
        public async Task<ActionResult> UpdateMatch([FromBody] matchDto _matchDto)
        {
            if (_matchDto.currentmatchDetails != null)
            {
                try
                {
                   var res=await _unitOfWork.StartMatchRepository.updateCurrentMatchDetails(_matchDto);
                   return Ok(res);
                }
                catch (Exception ex)
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
            
        }
    }
}
