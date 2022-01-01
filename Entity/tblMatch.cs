using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblMatch
    {
        public tblMatch()
        {
            this.Created = DateTime.Now;
        }
        [BsonId]
        public int MatchId { get; set; }

        public string MatchName { get; set; }

        public int? MatchTypeId { get; set; }

        public string MatchTypes { get; set; }

        public int Status { get; set; }

        public string StatusName { get; set; }

        public bool? IsDeleated { get; set; }

        public DateTime? Created { get; set; }

        public DateTime? LastUpdated { get; set; }
    }
}
