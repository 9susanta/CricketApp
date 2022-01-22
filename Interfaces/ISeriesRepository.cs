using CricketApp._helpers;
using CricketApp.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface ISeriesRepository
    {
        Task<tblSeries> GetSeries(int objectId);
        Task<int> Create(tblSeries tblTeams);
        Task<PagedList<tblSeries>> GetSeriesList(seriesParam seriesParam);
        Task<bool> Update(int objectId, tblSeries tblTeams);
        Task<bool> Delete(int objectId);
        Task<bool> IsExist(string Name, string TeamTypes);
        Task<int> NextId();
    }
}
