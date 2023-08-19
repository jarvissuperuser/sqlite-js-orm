import { indices } from "./column.types.js";

export class ReferenceInfo {
    constructor(column = '', table = '', refColumn ='', rType= indices.FOREIGNKEY  ) {
        this.table = table;
        this.column = column;
        this.refColumn = refColumn;
        this.refType = rType;
    }
}