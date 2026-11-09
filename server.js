const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./backend/config');
const apiRoutes = require('./backend/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(config.PORT, () => {
    console.log(`🚀 เซิร์ฟเวอร์มังงะรันแล้วที่ลิงก์นี้ -> http://localhost:${config.PORT}`);
});
