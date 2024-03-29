﻿using CricketApp._helpers;
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
    public class MatchesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public MatchesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("add-match")]
        public async Task<ActionResult> AddMatch([FromBody] tblMatch tblMatch)
        {
            var result = await _unitOfWork.MatchRepository.Create(tblMatch);
            return Ok(result);
        }
        [HttpGet("get-match")]
        public async Task<ActionResult> GetMatch([FromQuery] matchParam teamParam)
        {
            var matches = await _unitOfWork.MatchRepository.GetMatchsList(teamParam);
            Response.AddPaginationHeader(matches.CurrentPage, matches.PageSize, matches.TotalCount, matches.TotalPages);
            return Ok(matches);
        }
        [HttpPut("update-match/{id}")]
        public async Task<ActionResult> EditMatch(int id, [FromBody] tblMatch tblMatch)
        {
            var teams = await _unitOfWork.MatchRepository.Update(id, tblMatch);

            return Ok(teams);
        }

        [HttpDelete("delete-match")]
        public async Task<ActionResult> DeleteMatch([FromQuery] int id)
        {
            var teams = await _unitOfWork.MatchRepository.Delete(id);

            return Ok(teams);
        }

        [HttpGet("get-matchdetails-byid")]
        public ActionResult GetMatchDetailsById([FromQuery]  int matchId)
        {
            var match = _unitOfWork.MatchRepository.GetMatchById(matchId);
            return Ok(match);
        }

        [HttpGet("get-new-match")]
        public async Task<ActionResult> GetNewMatch()
        {
            var nextMatchId = await _unitOfWork.MatchRepository.NextId();
            return Ok(nextMatchId);
        }
    }
}
