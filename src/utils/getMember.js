import * as responseUtils from './responseUtils';
import * as bungie from './bungie';
import * as voluspa from './voluspa';

async function getMember(membershipType, membershipId, withLeaderboardPositions) {
  let requests = [
    bungie.memberProfile(membershipType, membershipId, '100,104,200,202,204,205,300,301,302,303,304,305,306,800,900'), 
    bungie.memberGroups(membershipType, membershipId), 
    bungie.milestones()
  ];

  if (withLeaderboardPositions) {
    requests.push(voluspa.leaderboardPosition(membershipType, membershipId));
  }

  let [profile, groups, milestones, leaderboardPosition] = await Promise.all(requests);

  try {
    profile = responseUtils.profileScrubber(profile);
    groups = responseUtils.groupScrubber(groups);
  } catch (e) {

  }

  let data = {
    profile,
    groups,
    milestones
  }

  if (leaderboardPosition) {
    data.leaderboardPosition = leaderboardPosition;
  }

  return data;
}

export default getMember;
