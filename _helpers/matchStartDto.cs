﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp._helpers
{
    public class matchStartDto
    {
        public int matchDetailsId { get; set; }
        public int? matchId { get; set; }
        public int? teamAId { get; set; }
        public string teamAName { get; set; }
        public int? teamBId { get; set; }
        public string teamBName { get; set; }
        public int? totalOvers { get; set; }
        public int? tossWinTeamId { get; set; }
        public string tossWinTeamName { get; set; }
        public string tossDecideName { get; set; }
        public string tossBatting { get; set; }
        public DateTime? created { get; set; }
        public DateTime? lastUpdated { get; set; }
        public string teamAPlayers { get; set; }
        public string teamBPlayers { get; set; }
    }
}
