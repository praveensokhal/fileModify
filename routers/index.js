const express = require('express')
const router = express.Router();

const filedata = require('../commonFunction/FileModify');
router.post("/filedata",filedata.file)
module.exports = router;