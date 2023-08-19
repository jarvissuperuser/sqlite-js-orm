import { columnsMixin, refMixin} from "../modelling/index.js";

export class User {
    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.dateOfBirth = new Date();
        this.idNumber = '';
        this.id = 0;
    }
}
export class UsersDescription extends columnsMixin(User) {
    describe() {
        this.firstName = this.prop().string(48).n();
        this.lastName = this.prop().string().nn();
        this.idNumber = this.prop().string(13).n().u();
        this.dateOfBirth = this.prop().date().n();
        this.id = this.prop().p().int().nn();
        return this
    }

}