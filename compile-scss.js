const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// 定义 public 目录路径
const publicDir = path.join(__dirname, "public");

// 读取 public 目录
fs.readdir(publicDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error("无法读取 public 目录:", err);
  }

  // 过滤出 public 目录下的所有子目录
  const directories = files.filter((file) => file.isDirectory());

  // 遍历每个子目录
  directories.forEach((dir) => {
    const dirPath = path.join(publicDir, dir.name);
    const scssFile = path.join(dirPath, "index.scss");
    const cssFile = path.join(dirPath, "index.css");

    // 检查 SCSS 文件是否存在
    if (fs.existsSync(scssFile)) {
      // 检查 CSS 文件是否已经存在
      if (fs.existsSync(cssFile)) {
        // 判断命令行参数是否传入了 --force 参数

        const args = process.argv.slice(2);
        if (args.includes("--force")) {
          // 如果有 --force 参数，则强制重新编译
          console.log(`强制重新编译 ${dir.name} 目录下的 SCSS 文件为 CSS.`);
          compileScss(scssFile, cssFile, dir.name);
        } else {
          // 如果没有 --force 参数，则跳过编译
          console.log(`${dir.name} 目录中的 CSS 文件已存在，跳过编译.`);
        }
      } else {
        // CSS 文件不存在，编译 SCSS
        compileScss(scssFile, cssFile, dir.name);
      }
    } else {
      console.log(`${dir.name} 目录中没有找到 SCSS 文件.`);
    }
  });
});

// 编译 SCSS 的函数
function compileScss(scssFile, cssFile, dirName) {
  exec(`sass ${scssFile} ${cssFile} --no-source-map`, (err, stdout, stderr) => {
    if (err) {
      console.error(`在 ${dirName} 编译 SCSS 时出错:`, err);
      return;
    }
    if (stderr) {
      console.error(`编译警告 (${dirName}):`, stderr);
    } else {
      console.log(`成功编译 ${dirName} 目录下的 SCSS 文件为 CSS.`);
    }
  });
}
