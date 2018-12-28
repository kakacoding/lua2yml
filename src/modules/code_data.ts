import { __values } from 'tslib';

// export interface ICode {
//     readonly head: string;
//     name: string;
//     comment: string;
//     [propName: string]: string;
// }

export enum EAccess {
    public,
    private,
    protected,
}

export class CodeField {
    name: string;
    access: EAccess;
    type: string;
    comment: string;
    constructor() {
        this.name = "";
        this.access = EAccess.public;
        this.type = "";
        this.comment = "";
    }
}

export class CodeParam {
    name: string;
    type: string;
    comment: string;
    constructor() {
        this.name = "";
        this.type = "";
        this.comment = "";
    }
}

export class CodeReturn {
    type: string;
    comment: string;
    constructor() {
        this.type = ""
        this.comment = ""
    }
}

export class CodeFunc {//implements IComment{
    name: string;//函数名
    indexer: string;//函数是:还是.
    comment: string;//函数注释
    base: string;//函数所属的类
    params: CodeParam[];//函数参数
    isLocal: boolean;//是否是local函数
    access: EAccess;//访问权限
    rets: CodeReturn[];
    ymlDeclaration: string;
    ymluid: string;
    constructor() {
        this.name = "";
        this.indexer = "";
        this.comment = ""
        this.base = "";
        this.params = [];
        this.isLocal = false;
        this.access = EAccess.public;
        this.rets = [];
        this.ymlDeclaration = "";
        this.ymluid = "";
    }
}

export class CodeClass {
    name: string;
    base: string;
    fields: CodeField[];
    funcs: CodeFunc[];
    comment: string;
    ymlDeclaration: string;
    references: string[];
    constructor(name = "", base = "", declaration = "") {
        this.name = name;
        this.base = base;
        this.fields = [];
        this.funcs = [];
        this.comment = "";
        this.ymlDeclaration = "";
        this.references = [];
    }
    pushRefrence(tp: string) {
        if (tp == "") return;
        if (this.references.find((value) => { return value == tp; }) == undefined) {
            this.references.push(tp);
        }
    }
}