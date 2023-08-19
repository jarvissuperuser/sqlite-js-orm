import { SqlBuilder } from "./src/Core.js";
import { UsersDescription, FilesDescription, User } from "./src/models/index.js";
import {dbTableDefiner} from './src/modelling/index.js'
import { Connection, npmConnection } from "./src/connect/index.js";
const data = { idNumber: '8909256753181', firstName: 'Tim', lastName: 'Mug', dateOfBirth: new Date('1989/09/25')};

(async function main() {
    const sb = new SqlBuilder();
    const tables = dbTableDefiner(UsersDescription, FilesDescription);
    //const refs = tables;
    //console.log(sb.CreateTable(tables));
    const user = new User();
    let select = (sb.Select('Users',user, 'id!=0',tables));
    let [update, vls]= sb.Update('Users', data,  ' id=9', tables);
    let [insert, val] = sb.Insert('Users', data,tables);
    //console.log(sb.Delete('Users','id=9'));
    const dbcon = new Connection(npmConnection, './test.db');
    await dbcon.execute(update,vls);
    //console.log({update})
    const vals = (await dbcon.query(select));
    console.log({vals, user});
    //console.log(dbDefiner(UsersDescription));
    //console.log(sb.CreateTable(tables));
    //console.log(sb.CreateTable(tables));
    //console.log(sb.Insert('users',tables['users'], tables));
    //console.log(sb.Update('users',data,undefined,tables));
})()