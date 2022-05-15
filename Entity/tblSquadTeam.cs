﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblSquadTeam
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public int seriesId { get; set; }
        public int teamId { get; set; }
        public string teamDetails{ get; set; }
    }
}
