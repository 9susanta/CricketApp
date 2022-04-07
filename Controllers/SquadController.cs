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
        [HttpPost("add-squad")]
        public async Task<ActionResult> UpdateSquad([FromBody] string squads)
        {
            if(!string.IsNullOrEmpty(squads))
            {
                try
                {
                    var listSquad = JsonConvert.DeserializeObject<List<tblSquads>>(squads);
                    var result = await _unitOfWork.SquadRepository.UpdateSquad(listSquad);

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return BadRequest();
                }
            }
            return BadRequest();
        }
    }
}
