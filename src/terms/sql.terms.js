export const TABLE = '@Tables';
export const COLUMNS = '@Columns';
export const TERMS = '@Terms';
export const VALUES = '@Values';
export const REFERENCE = 'REFERENCE';

export const CREATETABLE = `CREATE TABLE IF NOT EXISTS ${TABLE} (${COLUMNS});`;
export const INSERT = `INSERT INTO ${TABLE} (${COLUMNS}) VALUES (@Values)`;
export const UPDATE = `UPDATE ${TABLE} SET ${COLUMNS} WHERE @Terms`;
export const DELETE = `DELETE FROM ${TABLE} WHERE @Terms`;
export const SELECT = `SELECT ${COLUMNS} FROM ${TABLE} WHERE @Terms`
