using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblSquads
    {
        public tblSquads()
        {
            this.Created = DateTime.Now;
        }
        [BsonId]
        public int SquadsId { get; set; }
        public int SeriesId { get; set; }
        public int PlayersId { get;set;}
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
