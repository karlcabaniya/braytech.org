// Bungie API access convenience methods

class BungieError extends Error {
  constructor(request) {
    super(request.Message);

    this.errorCode = request.ErrorCode;
    this.errorStatus = request.ErrorStatus;
  }
}

async function apiRequest(path, options = {}) {
  const defaults = {
    headers: {},
    stats: false
  };
  const stats = options.stats || false;
  options = { ...defaults, ...options };
  options.headers['X-API-Key'] = process.env.REACT_APP_BUNGIE_API_KEY;
  if (options.method === 'post') {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const request = await fetch(`https://${stats ? 'stats' : 'www'}.bungie.net${path}`, options).then(r => r.json());

  if (request.ErrorCode !== 1) {
    throw new BungieError(request);
  }

  return request.Response;
}

export const GetDestinyManifest = async () => apiRequest('/Platform/Destiny2/Manifest/');

export const GetCommonSettings = async () => apiRequest(`/Platform/Settings/`);

export const GetPublicMilestones = async () => apiRequest('/Platform/Destiny2/Milestones/');

export const GetOAuthAccessToken = async body =>
  apiRequest('/Platform/App/OAuth/Token/', {
    method: 'post',
    body
  });

export const manifest = async version => fetch(`https://www.bungie.net${version}`).then(a => a.json());

export const GetProfile = async (membershipType, membershipId, components) => apiRequest(`/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=${components}`);

export const GetGroupsForMember = async (membershipType, membershipId) => apiRequest(`/Platform/GroupV2/User/${membershipType}/${membershipId}/0/1/`);

export const GetGroupByName = async (groupName, groupType = 1) => apiRequest(`/Platform/GroupV2/Name/${encodeURIComponent(groupName)}/${groupType}/`);

export const GetMembersOfGroup = async groupId => apiRequest(`/Platform/GroupV2/${groupId}/Members/`);

export const GetGroup = async groupId => apiRequest(`/Platform/GroupV2/${groupId}/`);

export const GetClanWeeklyRewardState = async groupId => apiRequest(`/Platform/Destiny2/Clan/${groupId}/WeeklyRewardState/`);

export const GetHistoricalStats = async (membershipType, membershipId, characterId = '0', groups, modes, periodType) => apiRequest(`/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/0/Stats/?groups=${groups}&modes=${modes}&periodType=${periodType}`);

export const SearchDestinyPlayer = async (membershipType, displayName) => apiRequest(`/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(displayName)}/`);

export const GetActivityHistory = async (membershipType, membershipId, characterId, count, mode = false, page) => apiRequest(`/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/?page=${page}${mode ? `&mode=${mode}` : ''}&count=${count}`);

export const PGCR = async id => apiRequest(`/Platform/Destiny2/Stats/PostGameCarnageReport/${id}/`, { stats: true });
