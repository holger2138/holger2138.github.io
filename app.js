const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./route/index')(app);

app.listen(3000, () => {
    console.log('server is running');
});
