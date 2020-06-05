const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
    res.sendFile('index');
})

app.use('/', router);
app.listen(port, () => console.log(`listening on port ${port}`));