using CricketApp._helpers;
using CricketApp.Entity;
using CricketApp.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Data
{
    public class SquadRepository : ISquadRepository
    {
        private readonly IMongoCollection<tblSquads> _tblSquads;
        private readonly IMongoCollection<tblSeries> _tblSeries;
        private readonly IMongoCollection<tblPlayers> _tblPlayers;
        public SquadRepository(IMongoDatabase _mongoDatabase)
        {
            _tblSquads = _mongoDatabase.GetCollection<tblSquads>(nameof(tblSquads));
            _tblSeries= _mongoDatabase.GetCollection<tblSeries>(nameof(tblSeries));
            _tblPlayers = _mongoDatabase.GetCollection<tblPlayers>(nameof(tblPlayers));

        }
        public async Task<PagedList<SquadDto>> GetSquad(squadParam squadParam)
        {

            var players = from sqd in _tblSquads.AsQueryable()
                          join ser in _tblSeries.AsQueryable()
                          on sqd.SeriesId equals ser.SeriesId into tmp_ser
                          from tmp_se in tmp_ser.DefaultIfEmpty()
                          join ply in _tblPlayers.AsQueryable()
                          on sqd.PlayersId equals ply.PlayersId into tmp_ply
                          from tmp_pl in tmp_ply.DefaultIfEmpty()
                          select new SquadDto
                          {
                              SquadsId = sqd.SquadsId,
                              SeriesId = sqd.SeriesId,
                              Series = tmp_se.SeriesName,
                              PlayersId=sqd.PlayersId,
                              Player=tmp_pl.Name
                          };

            return PagedList<SquadDto>.CreateAsyc(players, squadParam.PageNumber, squadParam.PageSize); ;

        }

        public async Task<int> UpdateSquad(List<tblSquads> squads)
        {
            try
            {
                var filter = Builders<tblSquads>.Filter.Eq(c => c.SeriesId, squads.FirstOrDefault().SeriesId);
                var result = await _tblSquads.DeleteManyAsync(filter);
                await _tblSquads.InsertManyAsync(squads);
            }
            catch (Exception)
            {
            }
            return 1;
        }
    }
}
