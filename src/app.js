const exprss = require('express');
const cors = require('cors');
const user = require('./routes/user');
const admin = require('./routes/admin');
const post = require('./routes/post');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
require("./config/db");
app.use(cors({
    credentials: true
}))
const app = exprss();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("your server is running on port " + port);
})


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/user', user);
app.use('/api/admin', admin);
app.use('/api/post', post);
app.get('/', (req, res) => {
    //  req.io.emit('hi', { hi: "taymaa" })
    res.send('Wellcom to Chat API .... ');
});