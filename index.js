import { SqlBuilder } from "./src/Core.js";
import { UsersModel, FilesModel } from "./src/models/index.js";
import {dbContext} from './src/modelling/index.js'
import { Connection, npmConnection } from "./src/connect/index.js";
const data = { idNumber: '8909256753181', firstName: 'Tim', lastName: 'Mug', dateOfBirth: new Date('1989/09/25')};

(async function main() {
    const tables = dbContext(UsersModel, FilesModel);
})()
