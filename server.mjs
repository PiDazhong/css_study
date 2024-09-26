import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);

// 获取当前模块的目录路径
const __dirname = path.dirname(__filename);

const app = express();

// 允许跨域
app.use(cors());

// 提供根目录中的 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 设置静态文件路径
app.use(express.static(path.join(__dirname, 'public')));

app.get('/get-directories', (req, res) => {
  console.log('收到前端的请求 /get-directories');
  const directoryPath = path.join(__dirname, 'public');

  fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('读取目录时出错:', err);
      return res.status(500).json({ error: '无法读取目录' });
    }

    const excudes = ['images'];

    const directories = files
      .filter((file) => file.isDirectory())
      .map((dir) => ({
        name: dir.name,
        path: `/${dir.name}/index.html`,
      }))
      .filter((dir) => !excudes.includes(dir.name));

    console.log('返回的目录:', directories);
    res.json(directories);
  });
});

// 启动服务器
const port = 6207;

app.listen(port, () => {
  console.log(`服务器运行在 http://127.0.0.1:${port}`);
});
