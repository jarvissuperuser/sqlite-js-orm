import { columnsMixin, refMixin } from "../modelling/index.js";
import { UsersDescription } from "./user.model.js";


export class File {
    constructor() {
        this.id = 0;
        this.userId = 0;
        this.fileName = '';
        this.fileData = undefined;
    }
}
export class FilesDescription extends refMixin(columnsMixin(File)){
    describe() {
        this.id = this.prop().p().int().nn();
        this.userId = this.prop().nn().int();
        this.fileName = this.prop().string().n();
        this.fileData = this.prop().blob().n();
        this.refs = ()  => [ this.ref(UsersDescription, 'userId') ];
        return this;
    }

}