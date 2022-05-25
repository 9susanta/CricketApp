using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp._helpers
{
    public class squadDto
    {
        public int SquadsId { get; set; }
        public int SeriesId { get; set; }
        public string Series { get; set; }
        public int? teamId { get; set; }
        public string teams{ get; set; }
        public string players { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
