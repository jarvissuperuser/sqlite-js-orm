import {  refMixin } from "../modelling/index.js";
import {UsersModel} from "./user.model.js";
import {modelMixin} from "../modelling/abstractions.js";


export class File {
    constructor() {
        this.id = 0;
        this.userId = 0;
        this.fileName = '';
        this.fileData = undefined;
    }
}
export class FilesModel extends modelMixin(refMixin(File)){
    describe() {
        this.id = this.prop().p().int().nn();
        this.userId = this.prop().nn().int();
        this.fileName = this.prop().string().n();
        this.fileData = this.prop().blob().n();
        this.refs = ()  => [ this.ref(UsersModel, 'userId') ];
        return this;
    }

}
