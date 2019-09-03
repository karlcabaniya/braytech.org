import store from './reduxStore';
import * as bungie from './bungie';
import * as responseUtils from './responseUtils';

export async function getGroupMembers(group, getPending = false) {
  store.dispatch({
    type: 'GROUP_MEMBERS_LOADING'
  });

  let groupMembersResponse = await bungie.GetMembersOfGroup(group.groupId);
  let groupMembersPendingResponse = false;

  if (getPending) {
    try {
      groupMembersPendingResponse = await bungie.GetPendingMemberships(group.groupId);
    } catch (e) {

      store.dispatch({
        type: 'PUSH_NOTIFICATION',
        payload: {
          error: true,
          date: new Date().toISOString(),
          expiry: 86400000,
          displayProperties: {
            name: e.errorStatus,
            description: e.message,
            timeout: 10
          },
          javascript: e
        }
      });
    }
  }

  let memberResponses = await Promise.all(
    groupMembersResponse.results.map(async member => {
      try {
        const profile = await bungie.GetProfile(member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId, '100,200,202,204,900');

        if (!profile.characterProgressions.data) {
          return member;
        }
        
        member.profile = responseUtils.profileScrubber(profile);

        return member;
      } catch (e) {
        member.profile = false;
        return member;
      }
    })
  );

  let pendingResponses = groupMembersPendingResponse
    ? await Promise.all(
        groupMembersPendingResponse.results.map(async member => {
          try {
            const profile = await bungie.GetProfile(member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId, '100,200,202,204,900');

            if (!profile.characterProgressions.data) {
              return member;
            }

            member.profile = responseUtils.profileScrubber(profile);
            
            member.pending = true;

            return member;
          } catch (e) {
            member.profile = false;

            member.pending = true;

            return member;
          }
        })
      )
    : [];

  let payload = {
    groupId: group.groupId,
    members: memberResponses,
    pending: pendingResponses,
    lastUpdated: new Date().getTime()
  };

  store.dispatch({
    type: 'GROUP_MEMBERS_LOADED',
    payload
  });

  return true;
}

export default getGroupMembers;
