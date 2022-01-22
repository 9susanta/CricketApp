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
    public class SeriesRepository : ISeriesRepository
    {
        private readonly IMongoCollection<tblSeries> _tblSeries;
        public SeriesRepository(IMongoDatabase _mongoDatabase)
        {
            _tblSeries = _mongoDatabase.GetCollection<tblSeries>(nameof(tblSeries));

        }
        public async Task<int> Create(tblSeries tblSeries)
        {
            try
            {
                var isExist = await IsExist(tblSeries.SeriesName, tblSeries.SeriesTypes);
                if (!isExist)
                {
                    tblSeries.SeriesId = await NextId();
                    tblSeries.IsDeleated = false;
                    await _tblSeries.InsertOneAsync(tblSeries);

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
                var filter = Builders<tblSeries>.Filter.Eq(c => c.SeriesId, objectId);
                var update = Builders<tblSeries>.Update
                 .Set(c => c.IsDeleated, true);
                var result = await _tblSeries.UpdateOneAsync(filter, update);
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

        public Task<tblSeries> GetSeries(int objectId)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedList<tblSeries>> GetSeriesList(seriesParam seriesParam)
        {
            var series = await _tblSeries.Find(x => x.IsDeleated == false).ToListAsync();

            return PagedList<tblSeries>.CreateAsyc(series.AsQueryable(), seriesParam.PageNumber, seriesParam.PageSize); ;
        }

        public async Task<bool> IsExist(string Name, string Types)
        {
            try
            {
                var res = await _tblSeries.FindAsync(x => x.SeriesName == Name && x.SeriesTypes == Types);
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
                var series = await _tblSeries.FindAsync(x => x.Created != null);

                var last_item = series.ToList().OrderByDescending(x => x.Created).FirstOrDefault();

                if (last_item != null)
                {
                    return (last_item.SeriesId + 1);
                }
            }
            catch (Exception ex)
            {
            }
            return 1;
        }

        public async Task<bool> Update(int objectId, tblSeries tblSeries)
        {
            try
            {
                var filter = Builders<tblSeries>.Filter.Eq(c => c.SeriesId, objectId);
                var update = Builders<tblSeries>.Update
                 .Set(c => c.SeriesName, tblSeries.SeriesName)
                 .Set(c => c.SeriesTypes, tblSeries.SeriesTypes)
                 .Set(c => c.SeriesTypeId, tblSeries.SeriesTypeId)
                 .Set(c => c.Status, tblSeries.Status)
                  .Set(c => c.StatusName, tblSeries.StatusName)
                 .Set(c => c.LastUpdated, DateTime.Now);
                var result = await _tblSeries.UpdateOneAsync(filter, update);
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
