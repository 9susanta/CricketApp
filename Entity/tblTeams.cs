using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblTeams
    {
        public tblTeams()
        {
            this.Created = DateTime.Now;
        }
        [BsonId]
        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public int? TeamTypeId { get; set; }

        public string TeamTypes { get; set; }

        public bool? IsDeleated { get; set; }

        public bool? IsAddedSeries { get; set; }

        public DateTime? Created { get; set; }

        public DateTime? LastUpdated { get; set; }
    }
}
