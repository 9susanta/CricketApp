﻿using MongoDB.Bson.Serialization.Attributes;
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
        public int matchId { get; set; }

        public string matchName { get; set; }

        public int? matchTypeId { get; set; }

        public string matchTypes { get; set; }

        public int teamHomeId { get; set; }

        public string teamHomeName { get; set; }

        public int teamVisitingId { get; set; }

        public string teamVisitingName { get; set; }

        public string location { get; set; }

        public DateTime fromDate { get; set; }

        public DateTime toDate { get; set; }

        public int seriesId { get; set; }

        public string StatusName { get; set; }

        public bool? IsDeleated { get; set; }

        public DateTime? Created { get; set; }

        public DateTime? LastUpdated { get; set; }
    }
}
