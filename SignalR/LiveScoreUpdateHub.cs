using CricketApp._helpers;
using CricketApp.Entity;
using CricketApp.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.SignalR
{
    public class LiveScoreUpdateHub:Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ActiveUsers _userTracker;
        public LiveScoreUpdateHub(IUnitOfWork unitOfWork, ActiveUsers userTracker)
        {
            _unitOfWork = unitOfWork;
            _userTracker = userTracker;
        }
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var matchId = httpContext.Request.Query["matchId"].ToString();
            var groupName = matchId;
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
           // var group = await AddToGroup(groupName);
            //var result = _unitOfWork.StartMatchRepository.getMatchTeamDetails(int.Parse(matchId));
            //await Clients.Caller.SendAsync("ReceiveLiveScoreThread", result);
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
           // var group = await RemoveFromMessageGroup();
            await base.OnDisconnectedAsync(exception);
        }
        public async Task SendScore(matchDto _matchDto)
        {
            var groupName = _matchDto.matchId.Value.ToString();

            await Clients.Group(groupName).SendAsync("NewScore", _matchDto);

            await _unitOfWork.StartMatchRepository.updateCurrentMatchDetails(_matchDto);
        }
        private async Task<Group> AddToGroup(string matchId)
        {
            var group = await _unitOfWork.ScoreRepository.GetLiveScoreGroup(matchId);
            var connection = new Connection(Context.ConnectionId, matchId);

            if (group == null)
            {
                group = new Group(matchId);
                _unitOfWork.ScoreRepository.AddGroup(group);
            }

            _unitOfWork.ScoreRepository.AddConnections(connection);

            return group;

            throw new HubException("Failed to join group");
        }
        private async Task<Group> RemoveFromMessageGroup()
        {
            var connection = await _unitOfWork.ScoreRepository.GetGroupForConnection(Context.ConnectionId);
            _unitOfWork.ScoreRepository.RemoveConnection(connection);
             return new Group(connection.GroupName);

            throw new HubException("Failed to remove from group");
        }
    }
}
