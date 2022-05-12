using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblSeries
    {
        public tblSeries()
        {
            this.Created = DateTime.Now;
        }
        [BsonId]
        public int SeriesId { get; set; }

        public string SeriesName { get; set; }

        public int? SeriesTypeId { get; set; }

        public string SeriesTypes { get; set; }

        public string location {get; set;}

        public DateTime startDate { get; set; }

        public DateTime endDate { get; set; }

        public int Status { get; set; }

        public string StatusName { get; set; }

        public bool? IsDeleated { get; set; }

        public DateTime? Created { get; set; }

        public DateTime? LastUpdated { get; set; }
    }
}
