const express = require('express');
const path = require('path');
const app = express();

// 设置静态文件目录
app.use(express.static(__dirname));

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 