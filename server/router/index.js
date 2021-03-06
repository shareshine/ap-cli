/* global require */
/* global module */

const router = require('koa-router')();
const cfs = require('../../common/cfs');
const utils = require('../../common/utils');
const Logger = require('../../common/logger');
const Swagger = require('./swagger/index');
const Js = require('./js/index');
const Json = require('./json/index');
const config = require('../../config');
// commander options
const options = require('../../bin/build/option.js');

// 参数
const { ROOT, PROJ, FILE_WHITE_LIST } = config;

// add url-route:
router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>当前启动的文件${PROJ}${ options.mock || '' }</h1>`;
});


/**
 * 初始化路由（接口） 【js, json】
 * @param fileName 文件名  example: exam.js，exam.json
 */
const initRouter = (fileName) => {
  const suffix = utils.getFileNameSuffix(fileName);
  if (suffix === 'js') {
    Js.requireJsInitRouter(fileName, router);
  } else {
    Json.readFileInitRouter(fileName, router);
  }
};

/**
 * 扫描文件添加Api
 * @param options 命令行参数
 * 【mock, port, regexp】
 */
const scanFileAddInterface = (options) => {
  // 扫描当前目录下的文件,获取文件名数组
  cfs.readdir(`${PROJ}`).then((res) => {
    // 执行当前目录下的文件【js, json】
    if (options.mock === 'true' || options.mock === 'all' ) {
      // 获取白名单内的文件数组
      const result = res.filter((fileName) => {
        let flag = false;
        const suffix = utils.getFileNameSuffix(fileName);
        // 文件后缀白名单
        if (FILE_WHITE_LIST.includes(suffix)) {
          flag = true;
        } else {
          Logger.WARN(`${fileName}不在白名单内！\n可通过修改${ROOT}下的config.js添加白名单！`);
        }
        return flag;
      });
      let filterResult = result;
      // 正则匹配文件
      if (options.regexp) {
        // 转换为正则
        const regexp = utils.strToRegExp(options.regexp);
        filterResult = result.filter((item) => regexp.test(item));
      }
      Logger.INFO(`扫描到 ${filterResult} 这${filterResult.length}个文件`);
      filterResult.forEach((fileName) => {
        // 异步读取文件内容
        initRouter(fileName);
      });
    } else { // 执行该目录下指定的文件
      // 异步读取文件内容
      initRouter(options.mock);
    }
  }).catch((error) => {
    Logger.ERROR(error);
  });
};

/**
 * 启动服务
 */
const startRun = () => {
  if (options.swagger) {
    // 转换swagger文件为接口模板文件
    Swagger.convertToJsonTpl(options.swagger);
  }
  if (options.mock) {
    // 启动 扫描文件添加Api
    scanFileAddInterface(options);
  } else {
    Logger.WARN('-m [fileName]为启动mock服务的必须参数;\n[fileName]为当前目录下的文件名，默认all当前目录下的所有文件;')
  }
};
startRun();

module.exports = router;