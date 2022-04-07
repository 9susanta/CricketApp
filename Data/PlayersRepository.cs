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
    public class PlayersRepository : IPlayersRepository
    {
        private readonly IMongoCollection<tblPlayers> _tblPlayers;
        private readonly IMongoCollection<tblTeams> _tblTeams;
        public PlayersRepository(IMongoDatabase _mongoDatabase)
        {
            _tblPlayers = _mongoDatabase.GetCollection<tblPlayers>(nameof(tblPlayers));
            _tblTeams= _mongoDatabase.GetCollection<tblTeams>(nameof(tblTeams));

        }
        public async Task<int> Create(tblPlayers tblPlayers)
        {
            try
            {
                var isExist = await IsExist(tblPlayers.Name);
                if (!isExist)
                {
                    tblPlayers.PlayersId = await NextId();
                    tblPlayers.IsDeleated = false;
                    await _tblPlayers.InsertOneAsync(tblPlayers);

                    return 1;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        public async Task<bool> Delete(int objectId)
        {
            try
            {
                var filter = Builders<tblPlayers>.Filter.Eq(c => c.PlayersId, objectId);
                var update = Builders<tblPlayers>.Update
                 .Set(c => c.IsDeleated, true);
                var result = await _tblPlayers.UpdateOneAsync(filter, update);
                if (result.ModifiedCount > 0)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }

        public async Task<tblPlayers> GetPlayers(int objectId)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedList<PlayerDto>> GetPlayersList(playerParam seriesParam)
        {
            var _player = await _tblPlayers.Find(x => x.IsDeleated == false).ToListAsync();

            var _teams = _tblTeams.Find(x => x.IsDeleated == false).ToList();

            var players = from pl in _player
                          join tm in _teams
                          on pl.InternationalTeam equals tm.TeamId into tmp_team
                          from tmp_tem in tmp_team.DefaultIfEmpty()
                          select new PlayerDto 
                          { 
                              PlayersId=pl.PlayersId, 
                              Name=pl.Name,
                              InternationalTeam=pl.InternationalTeam,
                              IsActive=pl.IsActive,
                              IsDeleated=pl.IsDeleated,
                              IsLocalPlayer=pl.IsLocalPlayer,
                              TeamName = tmp_tem?.TeamName
                          };

            return PagedList<PlayerDto>.CreateAsyc(players.AsQueryable(), seriesParam.PageNumber, seriesParam.PageSize); ;
        }

        public async Task<bool> IsExist(string Name)
        {
            try
            {
                var res = await _tblPlayers.FindAsync(x => x.Name == Name);
                return res.Any();
            }
            catch (Exception ex)
            {

                return true;
            }
        }

        public async Task<int> NextId()
        {
            try
            {
                var series = await _tblPlayers.FindAsync(x => x.Created != null);

                var last_item = series.ToList().OrderByDescending(x => x.Created).FirstOrDefault();

                if (last_item != null)
                {
                    return (last_item.PlayersId + 1);
                }
            }
            catch (Exception ex)
            {
            }
            return 1;
        }

        public async Task<bool> Update(int objectId, tblPlayers tblPlayers)
        {
            try
            {
                var filter = Builders<tblPlayers>.Filter.Eq(c => c.PlayersId, objectId);
                var update = Builders<tblPlayers>.Update
                 .Set(c => c.Name, tblPlayers.Name)
                 .Set(c => c.JerseyName, tblPlayers.JerseyName)
                 .Set(c => c.JerseyNo, tblPlayers.JerseyNo)
                 .Set(c=>c.IsLocalPlayer,tblPlayers.IsLocalPlayer)
                 .Set(c => c.InternationalTeam, tblPlayers.InternationalTeam)
                 .Set(c=>c.IsActive,tblPlayers.IsActive)
                 .Set(c => c.LastUpdated, DateTime.Now);
                 
                var result = await _tblPlayers.UpdateOneAsync(filter, update);
                if (result.ModifiedCount > 0)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }
    }
}
