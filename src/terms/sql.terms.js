export const TABLE = '@Tables';
export const COLUMNS = '@Columns';
export const TERMS = '@Terms';
export const CLAUSE = '@Clause';
export const VALUES = '@Values';
export const REFERENCE = 'REFERENCE';
export const AND = 'AND';
export const OR = 'OR';
export const EQ = '=';
export const LIKE = 'LIKE';
export const NOTEQ = '<>';
export const ISNOT  = 'IS NOT';
export const GT = '>';
export const LT = '<';
export const GTE = '>=';
export const LTE = '<=';

export const CREATETABLE = `CREATE TABLE IF NOT EXISTS ${TABLE} (${COLUMNS});`;
export const INSERT = `INSERT INTO ${TABLE} (${COLUMNS}) VALUES (@Values)`;
export const UPDATE = `UPDATE ${TABLE} SET ${COLUMNS} WHERE ${CLAUSE}`;
export const DELETE = `DELETE FROM ${TABLE} WHERE ${CLAUSE}`;
export const SELECT = `SELECT ${COLUMNS} FROM ${TABLE} WHERE ${CLAUSE}`;
export const WHERE = () => {
    return {
        AND,
        OR,
        EQ,
        NOTEQ,
        ISNOT,
        GTE,
        LTE, LIKE,GT,
        LT,
    };
}
