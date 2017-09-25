'use strict';
module.exports = class CrashController {
    constructor() {
        this._userService = new UserService();
    }

    /**
     *
     * @param {*} req
     * @param {*} res
     */
    index (req, res) {
        res.send(result);
        throw new Error('index error');
    }

    leak (req, res) {
        res.send(result);
    }

    /**
     * curl -d '{id: "777", "name":"Ivan", "lastName":"Sidorov"}' -H "Content-Type: application/json" -X POST http://localhost:3000/crash
     * @param {*} req
     * @param {*} res 
     */
    crash (req, res) {
        let userSettings = req.body;
        console.dir(userSettings);
        let userProfile = this._userService.resolve(userSettings); 
        console.dir(userProfile);
        res.send(`Profile has been initialized for: ${userProfile.name} ${userProfile.lastName}`);
    }
};

class UserService {
    constructor () {
        this._userRewardsService = new UserRewardsService();
    }
    resolve (userSettings) {
        //get user rewards member info
        let rewardsMemberProfile = this._userRewardsService.get(userSettings);
        return rewardsMemberProfile;
    }
}

class UserRewardsService {
    get (userSettings) {
        let someRecievedLocalValue = 777;
         //There are no rewards for this user!
        return (userSettings.id === someRecievedLocalValue) ? userSettings : null;
    }
}
