'use strict';
module.exports = class CrashController {
    constructor(policy) {
        this._userService = new UserService(policy);
    }

    /**
     * curl -d '{id: "777", "name":"Ivan", "lastName":"Sidorov"}' -H "Content-Type: application/json" -X POST http://localhost:3000/crash
     */
    index (req, res) {
        let userSettings = req.body;
        console.dir(userSettings);
        let userProfile = this._userService.resolve(userSettings);
        console.dir(userProfile);

        res.send(`Profile has been initialized for: ${userProfile.name} ${userProfile.lastName}`);
    }
};

class UserService {
    constructor(policy) {
        this._userRewardsService = new UserRewardsService(policy);
    }
    resolve (userSettings) {
        //get user rewards member info
        let rewardsMemberProfile = this._userRewardsService.get(userSettings);
        return rewardsMemberProfile;
    }
}

class UserRewardsService {
    constructor(policy) {
        this._policy = policy;
    }

    get (userSettings) {
        let someRecievedLocalValue = 777;
        //There are no rewards for this user!
        return (userSettings.id === this._policy.id) ? userSettings : null;
    }
}
