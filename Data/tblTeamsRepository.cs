using CricketApp._helpers;
using CricketApp.Entity;
using CricketApp.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Data
{
    public class tblTeamsRepository : ITeamsRepository
    {
        private readonly IMongoCollection<tblTeams> _tblTeams;
        public tblTeamsRepository(IMongoDatabase _mongoDatabase)
        {
            _tblTeams = _mongoDatabase.GetCollection<tblTeams>(nameof(tblTeams));

        }
        public async Task<int> Create(tblTeams tblTeamTypes)
        {
            try
            {
                var isExist = await IsExist(tblTeamTypes.TeamName, tblTeamTypes.TeamTypes);
                if (!isExist)
                {
                    tblTeamTypes.TeamId = await NextId();
                    tblTeamTypes.IsDeleated = false;
                    await _tblTeams.InsertOneAsync(tblTeamTypes);

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

        public Task<tblTeams> GetTeams(int objectId)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedList<tblTeams>> GetTeamsList(teamParam teamParam)
        {
            var teams = await _tblTeams.Find(x=>x.IsDeleated==false).ToListAsync();

            return PagedList<tblTeams>.CreateAsyc(teams.AsQueryable(), teamParam.PageNumber, teamParam.PageSize);
        }

        public async Task<bool> Update(int objectId, tblTeams tblTeams)
        {
            try
            {
                var filter = Builders<tblTeams>.Filter.Eq(c => c.TeamId, objectId);
                var update = Builders<tblTeams>.Update
                 .Set(c => c.TeamName, tblTeams.TeamName)
                 .Set(c => c.TeamTypeId, tblTeams.TeamTypeId)
                 .Set(c => c.TeamTypes, tblTeams.TeamTypes)
                 .Set(c => c.LastUpdated, DateTime.Now);
                var result = await _tblTeams.UpdateOneAsync(filter, update);
                if(result.ModifiedCount>0)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }

        public async Task<bool> Delete(int objectId)
        {
            try
            {
                var filter = Builders<tblTeams>.Filter.Eq(c => c.TeamId, objectId);
                var update = Builders<tblTeams>.Update
                 .Set(c => c.IsDeleated, true);
                var result = await _tblTeams.UpdateOneAsync(filter, update);
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

        public  async Task<bool> IsExist(string Name, string TeamTypes)
        {
            try
            {
               var res=await _tblTeams.FindAsync(x=>x.TeamName==Name&&x.TeamTypes == TeamTypes);
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
                var teams = await _tblTeams.FindAsync(x => x.Created != null);

                var last_item = teams.ToList().OrderByDescending(x => x.Created).FirstOrDefault();

                if(last_item!=null)
                {
                    return (last_item.TeamId + 1);
                }
            }
            catch (Exception ex)
            {
            }
            return 1;
        }
    }
}
