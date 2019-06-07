import * as responseUtils from './responseUtils';
import * as bungie from './bungie';
import * as voluspa from './voluspa';

async function getMember(membershipType, membershipId) {
  let [profile, groups, milestones, leaderboardPosition] = await Promise.all([
    bungie.memberProfile(membershipType, membershipId, '100,104,200,202,204,205,300,301,302,303,304,305,306,800,900'), 
    bungie.memberGroups(membershipType, membershipId), 
    bungie.milestones(),
    voluspa.leaderboardPosition(membershipType, membershipId)
  ]);

  try {
    profile = responseUtils.profileScrubber(profile);
    groups = responseUtils.groupScrubber(groups);
  } catch (e) {

  }

  return {
    profile,
    groups,
    milestones,
    leaderboardPosition
  };
}

export default getMember;
