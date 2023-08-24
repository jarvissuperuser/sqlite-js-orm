
import { UsersModel, FilesModel } from "./src/models/index.js";
import {dbContext} from './src/modelling/index.js';
const data = { idNumber: '8909256853181', firstName: 'Tavonga', lastName: 'Mugadza', dateOfBirth: new Date('1989/09/25'), id: 2};

(async function main() {
    const context = dbContext(UsersModel, FilesModel);
    const userCreated = await context.Users.create();
    const fileCreated = await context.Files.create();
    const fileData = new FilesModel();
    fileData.userId = 1;
    fileData.fileName = `test.file`;
    delete fileData.id;
    //const fileAdd = await context.Files.add(fileData);
    const files = await context.Files.findAll(({id}) => ({id: {NOTEQ: 0}}));
    //const updated = await context.Users.update(data,_ => ({id:data.id}));
    const all = await context.Users.findAll(({lastName}) => ({lastName: {LIKE:'mug%'}}));
    
    //const nw = await context.Users.add(data);
    console.log({all, files});
})()
