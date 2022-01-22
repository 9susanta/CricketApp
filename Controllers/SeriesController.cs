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
    public class SeriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public SeriesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("add-series")]
        public async Task<ActionResult> AddSeries([FromBody] tblSeries tblSeries)
        {
            tblSeries.SeriesTypes = new TypeList()._matchType.Where(x => x.Id == tblSeries.SeriesTypeId.Value).FirstOrDefault().MatchType;
            var result = await _unitOfWork.SeriesRepository.Create(tblSeries);

            return Ok(result);
        }
        [HttpGet("get-series")]
        public async Task<ActionResult> GetSeries([FromQuery] seriesParam seriesParam)
        {
            var teams = await _unitOfWork.SeriesRepository.GetSeriesList(seriesParam);

            Response.AddPaginationHeader(teams.CurrentPage, teams.PageSize, teams.TotalCount, teams.TotalPages);

            return Ok(teams);
        }
        [HttpPut("update-series/{id}")]
        public async Task<ActionResult> EditSeries(int id, [FromBody] tblSeries tblSeries)
        {
            tblSeries.SeriesTypes = new TypeList()._matchType.Where(x => x.Id == tblSeries.SeriesTypeId.Value).FirstOrDefault().MatchType;
            var teams = await _unitOfWork.SeriesRepository.Update(id, tblSeries);

            return Ok(teams);
        }

        [HttpDelete("delete-series")]
        public async Task<ActionResult> DeleteSeries([FromQuery] int id)
        {
            var teams = await _unitOfWork.SeriesRepository.Delete(id);

            return Ok(teams);
        }
    }
}
