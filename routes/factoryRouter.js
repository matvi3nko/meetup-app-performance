const router = require('express').Router();

module.exports = function factoryRouter (crashController) {
    // router.get('/', controller.index.bind(controller));
    // router.get('/leak/:value', controller.leak.bind(controller));
    router.post('/crash', crashController.index.bind(crashController));
    return router;
};
