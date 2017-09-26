'use strict';
module.exports = class CrashController {
    constructor(apiService) { this._userService = new UserService(apiService); }

    /**
     * curl -d '{id: 777, "name":"Ivan", "lastName":"Sidorov"}' -H "Content-Type: application/json" -X POST http://localhost:3000/crash
     */
    index (req, res) {
        let userSettings = req.body;
        let userProfile = this._userService.resolve(userSettings);
        res.end(`Profile has been initialized for: 
        ${userProfile.name} ${userProfile.lastName}`);
    }

    /**
     * curl -d '{id: 777, "name":"Ivan", "lastName":"Sidorov"}' -H "Content-Type: application/json" -X POST http://localhost:3000/crash/real
     */
    real (req, res) {
        let userSettings = req.body;
        this._userService.resolveAsync(userSettings)
            .then(function renderView (userProfile) {
                res.end(`Profile has been initialized for: ${userProfile.name} ${userProfile.lastName}`);
            });
    }
};

class UserService {
    constructor(apiService) { this._userRewardsService = new UserRewardsService(apiService); }
    resolve (userSettings) {
        //add user rewards member info
        let rewardsMemberProfile = this._userRewardsService.get(userSettings);
        return rewardsMemberProfile;
    }

    resolveAsync (userSettings) {
        //add user rewards member info
        return this._userRewardsService.getAsync(userSettings);
    }
}

class UserRewardsService {
    constructor(apiService) { this._apiService = apiService; }

    get (userSettings) {
        let policy = this._apiService.getRewardsPolicy();
        // is user rewards member
        return (userSettings.id === policy.userId) ? userSettings : null;
    }

    getAsync (userSettings) {
        let id = userSettings.id;
        let name = userSettings.name;
        let lastName = userSettings.lastName;
        let policy = this._apiService.getRewardsPolicy();

        return Promise.resolve().then(() => {
            return (userSettings.countryCode === policy.countryCode)
                ? { id, name, lastName }
                : null
        })
    }
}
