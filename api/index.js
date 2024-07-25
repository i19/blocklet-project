require('dotenv-flow').config();
require('express-async-errors');
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const fallback = require('@blocklet/sdk/lib/middlewares/fallback');
const { name, version } = require('../package.json');
const logger = require('./libs/logger');
const middlewares = require('./routes/middleware');
const isProduction = process.env.NODE_ENV === 'production' || process.env.ABT_NODE_SERVICE_ENV === 'production';

// 初始化数据库
(async () => {
  // moke data
  const dbFilePath = process.env.DB_FILE || path.resolve(__dirname, 'db.sqlite');
  require('./libs/db').init(dbFilePath);
  const userService = require('./model/user');
  await userService.init();
  if (!isProduction) {
    try {
      await userService.getByID(1);
    } catch (error) {
      try {
        userService.create({
          name: '张三',
          birthDay: '1990-01-15',
          gender: 1,
          email: 'zhangsan@example.com',
          phone: '13800138000',
          home_address: '北京市朝阳区某街道1号',
          work_address: '北京市海淀区某大厦15层',
        });
      } catch (ne) {
        console.error(ne);
      }
    }
  }
})();

// 设置 express 服务
const app = express();
app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json({ limit: '1 mb' }));
app.use(express.urlencoded({ extended: true, limit: '1 mb' }));
app.use(cors());
const router = express.Router();
router.use('/api', require('./routes'), middlewares.responseHandler);
app.use(router);
if (isProduction) {
  const staticDir = path.resolve(__dirname, '../dist');
  app.use(express.static(staticDir, { maxAge: '30d', index: false }));
  app.use(fallback('index.html', { root: staticDir }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });
}

const port = parseInt(process.env.BLOCKLET_PORT, 10);
const server = app.listen(port, (err) => {
  if (err) throw err;
  logger.info(`> ${name} v${version} ready on ${port}`);
});

module.exports = {
  app,
  server,
};
