const fs = require("fs-extra");
const nodePath = require("path");
const md5 = require("md5");

/**
 * 获取路径文件夹名
 * @param {String} path 路径
 * @returns 文件夹名
 */
function getDirName(path) {
  let arr = path.split("\\");
  let result = arr.pop();
  while (arr && !result) {
    result = arr.pop();
  }
  return result;
}

/**
 * 获取文件夹下所有图片文件数组
 * @param {String} path 路径
 * @returns 图片文件数组
 */
function getAllImage(path) {
  let result = [];
  const stats = fs.statSync(path);
  const imgReg = checkFileName(["jpg", "png", "gif", "jpeg"]);
  if (stats.isDirectory()) {
    let files = fs.readdirSync(path);
    files.forEach((v) => {
      const nowPath = nodePath.join(path, v);
      const st = fs.statSync(nowPath);
      if (st.isFile() && imgReg.test(v)) {
        result.push(v);
      }
    });
  }
  return result.sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

/**
 * 生成检验后缀名正则对象
 * @param {String[]} arr 后缀名数组
 * @returns 正则对象
 */
function checkFileName(arr) {
  arr = arr.map((name) => `.${name}`).join("|");
  return new RegExp(`(${arr})$`);
}

class ComicFileData {
  /**
   * 传入绝对路径获取漫画数据列表
   * @param {String} path 绝对路径
   */
  constructor(path) {
    if (!path) {
      path = process.cwd();
    }
    this.dirName = getDirName(path);
    this.imgs = getAllImage(path);
    this.path = path;
    this.md5 = md5(path);
  }
}

module.exports = ComicFileData;
