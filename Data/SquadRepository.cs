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
        private readonly IMongoCollection<tblSquadTeam> _tblSquadsTeam;
        private readonly IMongoCollection<tblSquadPlayer> _tblSquadPlayer;
        private readonly IMongoCollection<tblSeries> _tblSeries;
        private readonly IMongoCollection<tblPlayers> _tblPlayers;
        public SquadRepository(IMongoDatabase _mongoDatabase)
        {
            _tblSquadsTeam = _mongoDatabase.GetCollection<tblSquadTeam>(nameof(tblSquadTeam));
            _tblSquadPlayer = _mongoDatabase.GetCollection<tblSquadPlayer>(nameof(tblSquadPlayer));
            _tblSeries = _mongoDatabase.GetCollection<tblSeries>(nameof(tblSeries));
            _tblPlayers = _mongoDatabase.GetCollection<tblPlayers>(nameof(tblPlayers));

        }
        public async Task<List<SquadDto>> GetSquad(int seriesId)
        {

            return await Task.FromResult((from ser in _tblSeries.AsQueryable().ToEnumerable()
                         join sqdtm in _tblSquadsTeam.AsQueryable().ToEnumerable()
                         on ser.SeriesId equals sqdtm.seriesId 

                          join sqdply in _tblSquadPlayer.AsQueryable().ToEnumerable()
                          on sqdtm.teamId equals sqdply.teamId into tmp_sqdply
                          from tmp_sqdpl in tmp_sqdply.DefaultIfEmpty()
                          where ser.SeriesId==seriesId
                          select new SquadDto
                          {
                              SeriesId = ser.SeriesId,
                              Series = ser.SeriesName,
                              teamId= sqdtm.teamId,
                              teams= sqdtm.teamDetails,
                              players= tmp_sqdpl?.playerSquadDetails
                          }).ToList());

        }
        public async Task<int> UpdateSquadPlayer(tblSquadPlayer squadsPlayer)
        {
            try
            {
                var filter = Builders<tblSquadPlayer>.Filter.Eq(c => c.teamId, squadsPlayer.teamId);

                var result = await _tblSquadPlayer.DeleteManyAsync(filter);
                await _tblSquadPlayer.InsertOneAsync(squadsPlayer);
            }
            catch (Exception)
            {
                return 0;
            }
            return 1;
        }
        public async Task<int> UpdateSquadTeam(List<tblSquadTeam> squadsTeams)
        {
            try
            {
                var filter = Builders<tblSquadTeam>.Filter.Eq(c => c.seriesId, squadsTeams.FirstOrDefault().seriesId);
               
                var result = await _tblSquadsTeam.DeleteManyAsync(filter);
                await _tblSquadsTeam.InsertManyAsync(squadsTeams);

            }
            catch (Exception)
            {
                return 0;
            }
            return 1;
        }
    }
}
