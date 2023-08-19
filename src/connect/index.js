import  sqlite3  from "sqlite3";
import { open } from "sqlite";


export class Connection {
    constructor(connection, dbFile = './test.db') {
        let self = this;
        this.dbFile = dbFile;
        connection(dbFile).then(db =>{ self.db = db});
    }
    async query(sql, data) {
        if (!this.db) this.db = await npmConnection(this.dbFile);
        const statement = await this.db.prepare(sql);
        return statement.all(data);
    }
    async queryRaw(sql) {
        if (!this.db) this.db = await npmConnection(this.dbFile);
        return await this.db.all(sql);
    }
    async execute(sql, data) {
        if (!this.db) this.db = await npmConnection(this.dbFile);
        await this.db.run(sql,data);
    }
    async executeRaw(sql) {
        if (!this.db) this.db = await npmConnection(this.dbFile);
        await this.db.executeRaw(sql);
    }
    async setUpConnect(){
        if (!this.db) this.db = await npmConnection(this.dbFile);
    }


}

export const npmConnection = async (dbfile, driver = sqlite3.Database) => {
    return open({
        filename: dbfile,
        driver: driver
    })
}