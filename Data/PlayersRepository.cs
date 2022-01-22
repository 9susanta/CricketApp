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
        public PlayersRepository(IMongoDatabase _mongoDatabase)
        {
            _tblPlayers = _mongoDatabase.GetCollection<tblPlayers>(nameof(tblPlayers));

        }
        public async Task<int> Create(tblPlayers tblPlayers)
        {
            try
            {
                var isExist = await IsExist(tblPlayers.FirstName,tblPlayers.LastName, tblPlayers.InternationalTeam.Value);
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

        public async Task<PagedList<tblPlayers>> GetPlayersList(playerParam seriesParam)
        {
            var player = await _tblPlayers.Find(x => x.IsDeleated == false).ToListAsync();

            return PagedList<tblPlayers>.CreateAsyc(player.AsQueryable(), seriesParam.PageNumber, seriesParam.PageSize); ;
        }

        public async Task<bool> IsExist(string FirstName,string LastName, int InternationalTeam)
        {
            try
            {
                var res = await _tblPlayers.FindAsync(x => x.FirstName == FirstName&&x.LastName== LastName && x.InternationalTeam == InternationalTeam);
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
                 .Set(c => c.FirstName, tblPlayers.FirstName)
                 .Set(c => c.LastName, tblPlayers.LastName)
                 .Set(c => c.JerseyName, tblPlayers.JerseyName)
                 .Set(c => c.JerseyNo, tblPlayers.JerseyNo)
                 .Set(c => c.InternationalTeam, tblPlayers.InternationalTeam)
                 .Set(c=>c.DomesticTeam,tblPlayers.DomesticTeam)
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
