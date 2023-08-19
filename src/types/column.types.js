const REAL = 'REAL';
const TEXT = 'TEXT';
const INT = 'INT';
const INTEGER = 'INTEGER';
const BIGINT = 'BIGINT';
const BLOB = 'BLOB';
const BOOLEAN = 'BOOLEAN';
const NVARCHAR = 'NVARCHAR';
const DATETIME = 'DATETIME';
const DATE = 'DATE';




export const columnType = {
    DOUBLE: REAL,
    FLOAT: REAL,
    TEXT,
    INT: INTEGER,
    STRING: TEXT,
    REAL,
    LONG: BIGINT,
    DATETIME,
    DATE,
    NVARCHAR,
    BOOLEAN,
    BLOB
}

export const nullability = {
    NULLABLE: 'NULL',
    NOTNULLABLE: 'NOT NULL'
}

export const indices = {
    PRIMARY: 'PRIMARY KEY',
    FOREIGNKEY: 'FOREIGN KEY',
    UNIQUE: 'UNIQUE',
    NONE: ''
}
export const columnMixin =  Base => class extends Base {

};
export class ColumnInfo {
    
    constructor(colType = columnType.INT, length = undefined, defaults = nullability.NULLABLE, index = indices.NONE) {
        this.datatype = colType;
        this.datalength = length;
        this.valuedefault = defaults;
        this.indexing = index;
    }
}

export const setType = (colType = 'INT', length = undefined, defaults = 'NULL', index = '') => {
    return new ColumnInfo(colType, length, defaults, index);
}