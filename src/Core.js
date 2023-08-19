import { ReferenceBuilder } from "./modelling/abstractions.js";
import { CREATETABLE, TABLE, COLUMNS, TERMS, INSERT, VALUES, UPDATE, REFERENCE, SELECT, DELETE } from "./terms/sql.terms.js";
import { ColumnInfo, ReferenceInfo, columnType, indices, nullability } from "./types/index.js";



class ColumnInfoBuilder {
    /**
     * @param {ColumnInfo} columnInfo 
    */
    _columnSqlBuilder (columnInfo) {
        let columnSql = 
        `${this._columnDataBuilder(columnInfo)} ${this._columnDefaults(columnInfo)} ${this._columnIndexing(columnInfo)}`;
        
        return columnSql
    }
    /**
     * @param {ColumnInfo} columnInfo 
    */
    _columnDataBuilder(columnInfo) {
        let cs = '';
        if (!!columnInfo.datatype)
        switch(columnInfo.datatype) {
            case columnType.NVARCHAR:
                if (!columnInfo.datalength) columnInfo.datalength = '2048';
                cs = `${columnInfo.datatype}(${columnInfo.datalength})`;
                break;
            default:                
                cs = `${columnInfo.datatype}`;
                break;
        }
        return cs;
    }
    _columnDefaults(columnInfo) {
        let cs = '';
        if (columnInfo.valuedefault) {
            cs = `${columnInfo.valuedefault}`
        }
        return cs;
    }
    _columnIndexing(columnInfo) {
        let cs = '';
        switch(columnInfo.indexing) {
            case indices.PRIMARY:
                cs = `${indices.PRIMARY}`;
                if (columnInfo.datatype === columnType.INT 
                    || columnInfo.datatype === columnType.BIGINT
                    || columnInfo.datatype === columnType.LONG)
                    {
                        cs = `${indices.PRIMARY} autoincrement`
                }
                break;
            case indices.UNIQUE:
                 cs = `${indices.UNIQUE}`   
        }
        return cs;
    }

}
const refBuilder =  {
    /**
     * 
     * @param {ReferenceInfo} refInfo 
     * @returns 
     */
    refSqlBuilder: (refInfo) => {
        return `${refInfo.refType} (${refInfo.column}) ${REFERENCE}S ${refInfo.table}(${refInfo.refColumn})`
    }
}

export class SqlBuilder {
    
    CreateTable(tableConfig) {
        let sql = '';
        let columnSql = '';
        const colBuilder = new ColumnInfoBuilder();
        for (const key in tableConfig) {
            if (Object.hasOwnProperty.call(tableConfig, key)) {
                const tableColumns = tableConfig[key];
                const columns = [];
                for(const columnName in tableColumns) {
                    if (columnName !== 'refs')
                    columns.push(`${columnName} ${colBuilder._columnSqlBuilder(tableColumns[columnName])}`);
                }
                if (tableColumns.refs){
                    for(const ref of tableColumns.refs()){
                        columns.push(refBuilder.refSqlBuilder(ref));
                    }
                }
                columnSql = columns.join(',');
                sql = sql +CREATETABLE.replace(TABLE,key).replace(COLUMNS,columnSql);
            }
        }
        return sql;
    }

    Insert(table, data, tables = {}) {
        const dataColumns = Object.keys(tables[table]);
        const columns = [];
        const terms = [];
        const vals = [];
        for (const columnName in data) {
            if (dataColumns.includes(columnName)){
                columns.push(columnName);
                terms.push('?');
                vals.push(data[columnName]);
            }
        }
        return [INSERT.replace(TABLE,table)
            .replace(COLUMNS, columns.join(','))
            .replace(VALUES, terms.join(',')), vals]
    }

    Update(table, data, term = undefined ,tables = {}) {
        const dataColumns = Object.keys(tables[table]);
        const columns = [];
        let val = [];
        for (const columnName in data) {
            if (dataColumns.includes(columnName)){
                columns.push(`${columnName} = ?`);
                val.push(data[columnName]);
                if (!term && tables[table][columnName].indexing === indices.PRIMARY){
                    term = `${columnName} = '${data[columnName]}'`
                }
            }
        }
        return [UPDATE.replace(TABLE, table)
            .replace(COLUMNS,columns.join(','))
            .replace(TERMS, term), val ];

    }
    Select(table, data,term, tables = {}) {
        const dataColumns = Object.keys(tables[table]);
        const columns = []
        for (const columnName in data) {
            if (dataColumns.includes(columnName)) {
                columns.push(columnName);
                
            }
        }
        return SELECT.replace(TABLE,table)
            .replace(COLUMNS,columns.join(','))
            .replace(TERMS,term);

    }
    Delete(table, term) {
        return DELETE.replace(TABLE, table)
            .replace(TERMS, term);
    }
}