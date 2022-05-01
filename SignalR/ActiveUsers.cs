using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.SignalR
{
    
    public class ActiveUsers
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers =
            new Dictionary<string, List<string>>();
        public Task<bool> UserConnected(string matchId, string connectionId)
        {
            bool isOnline = false;
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(matchId))
                {
                    OnlineUsers[matchId].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(matchId, new List<string> { connectionId });
                    isOnline = true;
                }
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string matchId, string connectionId)
        {
            bool isOffline = false;
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(matchId)) return Task.FromResult(isOffline);

                OnlineUsers[matchId].Remove(connectionId);
                if (OnlineUsers[matchId].Count == 0)
                {
                    OnlineUsers.Remove(matchId);
                    isOffline = true;
                }
            }

            return Task.FromResult(isOffline);
        }
        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }
        public Task<List<string>> GetConnectionsForUser(string matchId)
        {
            List<string> connectionIds;
            lock (OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(matchId);
            }

            return Task.FromResult(connectionIds);
        }
    }
}
