import { ReferenceBuilder } from "./modelling/abstractions.js";
import {
    CREATETABLE,
    TABLE,
    COLUMNS,
    TERMS,
    INSERT,
    VALUES,
    UPDATE,
    REFERENCE,
    SELECT,
    DELETE,
    WHERE,
    CLAUSE, NOTEQ, EQ
} from "./terms/sql.terms.js";
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
    
    createTable(tableConfig) {
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

    insert(table, data, tables = {}) {
        const dataColumns = Object.keys(tables[table]);
        const columns = [];
        const terms = [];
        const vals = {};
        for (const columnName in data) {
            if (dataColumns.includes(columnName) && columnName !== 'refs'){
                columns.push(columnName);
                terms.push(`:${columnName}`);
                vals[`:${columnName}`]=(data[columnName]);
            }
        }
        return INSERT.replace(TABLE,table)
            .replace(COLUMNS, columns.join(','))
            .replace(VALUES, terms.join(','))
    }

    update(table, data, where= _ => _ , tables = {}) {
        const dataColumns = Object.keys(tables[table]);
        const columns = [];
        for (const columnName in data) {
            if (dataColumns.includes(columnName)){
                columns.push(`${columnName} = :${columnName}`);
            }
        }
        return UPDATE.replace(TABLE, table)
            .replace(COLUMNS,columns.join(','))
            .replace(CLAUSE, this._whereProcessor(where));

    }
    select(table, data, where = _ => _ , tables = {}) {
        const dataColumns = Object.keys(tables[table]);
        const columns = []
        for (const columnName in data) {

            if (dataColumns.includes(columnName) && columnName !== 'refs') {
                columns.push(columnName);
            }
        }
        return SELECT.replace(TABLE,table)
            .replace(COLUMNS,columns.join(','))
            .replace(CLAUSE,this._whereProcessor(where));

    }
    delete(table, where = _ => _) {
        return DELETE.replace(TABLE, table)
            .replace(CLAUSE, this._whereProcessor(where));
    }

    _whereProcessor(where) {
        if (typeof where !== "function") throw new Error('Unsupported where clause');
        const whereRaw = where.toString();
        let whereStr = whereRaw.split('=>')[0];
        let whereClause = '';
        const whereClauseLex = where({});
        if (!whereStr || whereStr === 'null' || whereStr === 'true') throw new Error('Unsupported where clause');
        Object.entries(whereClauseLex).forEach(([k,v]) => {
            whereClause = ( !!v.push ) ?
                whereClause = `${whereClause} ${v.map((item) => {
                    return Object.entries(item).map(this._conditioner);
                }).join(` ${k} `)} `: this._conditioner([k,v]);
        });

        return whereClause;
    }
    _conditioner = ([ky,vl]) => {
        switch (typeof vl){
            case 'object':
                const opKey = Object.keys(vl)[0];
                const op = WHERE()[opKey];
                return `(${ky} ${op} :${ky})`
            default:
                return `(${ky} ${EQ} :${ky})`
        }
    }
    _innerData(format,data ={}) {
        Object.entries(data).forEach(([k,v]) => {
            if (k !=='refs')
            switch (typeof v){
                case 'object':
                    const opKey = Object.keys(v)[0];
                    (!!v.getDate)? format[`:${k}`] = v:
                    format[`:${k}`] = v[opKey];
                    break;
                default:
                    format[`:${k}`] = v;
            }
        });
        return format;
    }
    dataPrep(where = _ => ({})) {
        const data = where({});
        let format = {}
        Object.entries(data).forEach(([k,v]) => {
            if (v && k !== 'refs')
            (!!v.push) ? v.forEach(item => {
                format = this._innerData(format, item);
                console.log(item,format)
            }): format = this._innerData(format, data);
        })
        return format;
    }
}
