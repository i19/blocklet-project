const myError = require('../utils/error');
const db = require('../libs/db');

class Model {
  #tableName;
  #columns;
  #insertStmt;
  #pagingStmt;
  #getByIDStmt;
  #insertValidator;
  #updateValidator;
  #initialized;
  #columnNames;

  constructor({ tableName, columns, insertValidator }) {
    this.#tableName = tableName;
    this.#insertValidator = insertValidator;

    // without id and created_at column
    this.#columnNames = Object.keys(columns).filter((k) => k !== 'id' && k !== 'created_at');
    // 因为采用了更宽松的限制规则，所以可以动态生成 updateValidator 无需再传递
    this.#updateValidator = insertValidator.fork(this.#columnNames, (schema) => schema.optional());
    // 添加默认字段，并确保 id 在第一列
    this.#columns = {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    };
    Object.keys(columns).forEach((k) => {
      if (k !== 'id') this.#columns[k] = columns[k];
    });
    this.#columns['created_at'] = 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP';

    // 常用 db 操作 statement
    this.#insertStmt = null;
    this.#pagingStmt = null;
    this.#getByIDStmt = null;

    this.#initialized = false;
  }

  async init() {
    if (this.#initialized) {
      return;
    }
    // 确保表的存在
    const columnDefinitions = Object.keys(this.#columns)
      .map((col) => `${col} ${this.#columns[col]}`)
      .join(', ');
    const sql = `CREATE TABLE IF NOT EXISTS ${this.#tableName} (${columnDefinitions})`;
    await db.get().exec(sql);

    // 创建所需的 statement
    const columnNames = Object.keys(this.#columns).filter((key) => key !== 'id' && key !== 'created_at');
    const placeholders = columnNames.map((columnName) => `@${columnName}`).join(', ');
    this.#insertStmt = await db
      .get()
      .prepare(`INSERT INTO ${this.#tableName} (${columnNames.join(', ')}) VALUES (${placeholders})`);
    this.#pagingStmt = await db.get().prepare(`SELECT * FROM ${this.#tableName} WHERE id >= ? LIMIT ?`);
    this.#getByIDStmt = await db.get().prepare(`SELECT * FROM ${this.#tableName} WHERE id = ?`);
    this.#initialized = true;
  }

  async create(data) {
    const { error, value } = this.#insertValidator.validate(data);
    if (error) throw new myError.ValidationError(error);

    try {
      const res = this.#insertStmt.run(value);
      return { id: res.lastInsertRowid };
    } catch (error) {
      throw new myError.DBOperationError(error.message);
    }
  }

  async update(id, data) {
    delete data['id'];
    delete data['created_at'];
    const { error, value } = this.#updateValidator.validate(data);

    if (error) throw new myError.ValidationError(error);
    if (Object.keys(value).length == 0) {
      return;
    }
    const setClause = Object.keys(value)
      .map((key) => `${key} = @${key}`)
      .join(', ');
    const updateStmt = db.get().prepare(`UPDATE ${this.#tableName} SET ${setClause} WHERE id = ?`);

    return updateStmt.run(value, id);
  }

  async getByID(id) {
    const res = this.#getByIDStmt.get(id);
    if (!res) {
      throw new myError.ResourceNotFound(`id ${id} for ${this.#tableName} is not exist`);
    }
    return res;
  }

  async paging(start, step) {
    return this.#pagingStmt.all(start, step);
  }
}

module.exports = { Model };
