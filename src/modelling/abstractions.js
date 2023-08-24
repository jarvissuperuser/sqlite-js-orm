import { ColumnInfo, ReferenceInfo, columnType, indices, nullability } from "../types/index.js"
import {SqlBuilder} from "../Core.js";
import {Connection, npmConnection} from "../connect/index.js";

export const columnsMixin = base => class extends base {
    prop() {
        return new ColumnBuilder();
    }
}

export const refMixin = base => class extends base {
    ref(tableDesc, column, iType = indices.FOREIGNKEY) {
        if (!isDescription(tableDesc)) throw new Error('Not table')
        let {tableName, description} = tableDescription(tableDesc);
        const tableColumn = idExtract(description)[0];
        return new ReferenceInfo(column, tableName, tableColumn, iType);
    }
}

export class ColumnBuilder extends ColumnInfo{
    constructor() {
        super(undefined,undefined,undefined,undefined);
    }
    /**
     * SET PRIMARY KEY
     * @returns ColumnInfo
     */
    p() {
        this.indexing = indices.PRIMARY;
        return this;
    }
    /**
     * NULLABLE
     * @returns ColumnInfo
     */
    n() {
        this.valuedefault = nullability.NULLABLE;
        return this;
    }
    /**
     * NOT NULLABLE
     * @returns ColumnInfo
     */
    nn() {
        this.valuedefault = nullability.NOTNULLABLE;
        return this;
    }
    /**
     * SET UNIQUE
     * @returns ColumnInfo
     */
    u() {
        this.indexing = indices.UNIQUE;
        return this;
    }
    /**
     * datatype TEXT | VARCHAR
     * @returns ColumnInfo
     */
    string(length = 0) {
        this.datatype = columnType.TEXT;
        if(length){
            this.datatype = columnType.NVARCHAR;
            this.datalength = length;
        }
        return this;
    }
    /**
     * datatype INTEGER
     * @returns ColumnInfo
     */
    int() {
        this.datatype = columnType.INT;
        return this
    }
    /**
     * datatype REAL
     * @returns ColumnInfo
     */
    real() {
        this.datatype = columnType.REAL;
        return this
    }
    /**
     * datatype BLOB
     * @returns ColumnInfo
     */
    blob(){
        this.datatype = columnType.BLOB;
        return this
    }
    /**
     * datatype DATE
     * @returns ColumnInfo
     */
    date(){
        this.datatype= columnType.DATE;
        return this
    }
    /**
     * datatype DATETIME
     * @returns ColumnInfo
     */
    dateTime(){
        this.datatype = columnType.DATETIME;
        return this;
    }
    /**
     * datatype BIGINT
     * @returns ColumnInfo
     */
    long(){
        this.datatype = columnType.LONG;
        return this;
    }

}
export class ReferenceBuilder extends ReferenceInfo {
    constructor() {
        super();
    }

}
const DESCRIPTION ='Model';

export const dbContext = function() {

    const tableDef = {};
    for (let i = 0; i < arguments.length; i++){
        if (isDescription(arguments[i])) {
            const tableDes = tableDescription(arguments[i])
            tableDef[tableDes.tableName] = tableDes.description;
        }
    }
    return tableDef;

}

export const tableDescription = (description) => {
    return {tableName: description.name.replace(DESCRIPTION,''), description: new description().describe()}
}

export const isDescription = (description) => {
    return description.name.includes(DESCRIPTION);
}

export const idExtract = (description) => {
    return Object.keys(description)
        .filter(d => description[d].indexing === indices.PRIMARY)
        ;
}


export const modelMixin = model => class extends model {
    prop() {
        return new ColumnBuilder();
    }

    async create() {
        const {sql, db} = this.sql();
        return await db.executeRaw(sql.createTable(this._prepTable()));
    }

    /**
     * @param {function} where
     * */
    async findAll(where = _=> ({})) {
        const {sql, db, tableName} = this.sql();
        const query = sql.select(tableName, this, where, this._prepTable());
        console.log(query);
        const prep = sql.dataPrep(where);
        const results = (await db.query(query,prep)).map(result => this._get(result))
        return results;
    }

    async find(where = _ => ({})) {
        return (await this.findAll(where))[0];
    }

    async update(data = {}, where =  _ => ({})) {
        const {sql, db, tableName} = this.sql();
        const query = sql.update(tableName,data,where,this._prepTable());
        const prep = sql.dataPrep(({}) => ({...data}));
        return (await db.execute(query,prep))
    }

    async add(data) {
        const {sql, db, tableName} = this.sql();
        const query = sql.insert(tableName,data,this._prepTable());
        const prep = sql.dataPrep(({}) => ({...data}));
        return (await db.execute(query,prep));
    }

    async delete(where = _ => ({})){
        const {} = this.sql();
    }
    sql() {
        return {sql: new SqlBuilder(), db: new Connection(npmConnection), tableName: this.constructor.name.replace(DESCRIPTION, '')}
    }
    _get (result = {}){
        const mdl = new model();
        Object.entries(result).forEach(([k,v]) => {
            mdl[k] = v;
        })
        return mdl;
    }
    _prepTable() {
        const table = {};
        const tableName = this.constructor.name.replace(DESCRIPTION,'');
        table[tableName] = this.describe();
        return table;
    }
}
