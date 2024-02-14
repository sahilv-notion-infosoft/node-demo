const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router
    .post('/create_user', userController.createUser);






router.use(function (err, req, res, next) {
    switch (err.status) {
        case 500:
            res.status(500).json({
                "success": false,
                "code": 4001,
                "error": err.message || "Server Error"
            });
            break;
        case 404:
            res.status(404).json({
                "success": false,
                "code": 4001,
                "error": err.message || "Resource not found"
            });
            break;
        case 401:
            res.status(401).json({
                "success": false,
                "code": 2001,
                "error": err.message || "Unauthorized"
            });
            break;
        case 403:
            res.status(403).json({
                "success": false,
                "code": 2002,
                "error": err.message || "Forbidden"
            });
            break;
        default:
            res.status(404).json({
                "success": false,
                "code": 4001,
                "error": err.message || "Resource not found"
            });
            break;
    }
});
exports.router = router;
