import { SqlBuilder } from "../Core";


export class DatabaseFramework {
    constructor(dbEntitiesInstance,sqlbuilderInstance,modellerInstance) {
        this.entities = dbEntitiesInstance;
        this.sql = sqlbuilderInstance;
        this.modeller = modellerInstance;
    }
    find(where = _ => ({})) {
    }
}
