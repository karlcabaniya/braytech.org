import * as responseUtils from './responseUtils';
import * as bungie from './bungie';
import * as voluspa from './voluspa';
import * as ls from './localStorage';

async function getMember(membershipType, membershipId, withLeaderboardPositions) {
  const auth = ls.get('setting.auth');

  let components = [100,104,200,202,204,205,300,301,302,303,304,305,306,800,900];

  let useAuth = false;
  if (auth.destinyMemberships.find(m => m.membershipId === membershipId)) {
    useAuth = true;
    components.push(102,201);
  }

  let requests = [
    bungie.GetProfile(membershipType, membershipId, components.join(','), useAuth), 
    bungie.GetGroupsForMember(membershipType, membershipId), 
    bungie.GetPublicMilestones()
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
