using CricketApp.Entity;
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
    public class SquadController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public SquadController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("add-squad-team")]
        public async Task<ActionResult> UpdateSquadTeam([FromBody] List<tblSquadTeam> squadTeam)
        {
            if(squadTeam.Count>0)
            {
                try
                {
                    var result = await _unitOfWork.SquadRepository.UpdateSquadTeam(squadTeam);

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    
                }
            }
            return BadRequest();
        }
        [HttpPost("add-squad-players")]
        public async Task<ActionResult> UpdateSquadPlayers([FromBody] tblSquadPlayer squadPlayers)
        {
            if (squadPlayers != null)
            {
                try
                {
                    var result = await _unitOfWork.SquadRepository.UpdateSquadPlayer(squadPlayers);

                    return Ok(result);
                }
                catch (Exception ex)
                {
                  
                }
            }
            return BadRequest();
        }

        [HttpGet("get-squad/{seriesId}")]
        public async Task<ActionResult> GetSquad(int seriesId)
        {
            
            try
            {
               
               var result = await _unitOfWork.SquadRepository.GetSquad(seriesId);

               return Ok(result);
            }
            catch (Exception ex)
            {

   
            }
            return BadRequest();
        }

    }
}
