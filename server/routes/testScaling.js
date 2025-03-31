const express = require('express');

const router = express.Router();

async function fibonacci(num) {
    if (num <= 1) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }

router.post('/', async (req, res) => {

    if(req.query.n) {
        const result = await fibonacci(req.query.n);
        return res.status(200).send(`Result ${result}`);
    }else{
        return res.status(200).send("Ok");
    }

});


module.exports = router;
