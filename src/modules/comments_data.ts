export interface IComment {
    readonly head: string;
    [propName: string]: any;
}

export class CommentClass implements IComment {
    readonly head: string;
    name: string;
    base: string;
    comment: string;
    [propName: string]: any;
    constructor() {
        this.head = "class";
        this.name = ""
        this.base = ""
        this.comment = ""
    }
}

export class CommentField implements IComment {
    readonly head: string;
    access: string;
    name: string;
    type: string;
    comment: string;
    [propName: string]: any;
    constructor() {
        this.head = "field";
        this.access = ""
        this.name = ""
        this.type = ""
        this.comment = ""
    }
}

export class CommentParam implements IComment {
    readonly head: string;
    name: string;
    type: string;
    comment: string;
    [propName: string]: any;
    constructor() {
        this.head = "param";
        this.name = ""
        this.type = ""
        this.comment = ""
    }
}

export class CommentReturn implements IComment {
    readonly head: string;
    type: string;
    comment: string;
    [propName: string]: any;
    constructor() {
        this.head = "return";
        this.type = ""
        this.comment = ""
    }
}

export class CommentAccess implements IComment {
    readonly head: string;
    access: string;
    [propName: string]: any;
    constructor() {
        this.head = "access";
        this.access = ""
    }
}

export class CommentComment implements IComment {
    readonly head: string;
    comment: string;
    [propName: string]: any;
    constructor() {
        this.head = "comment";
        this.comment = ""
    }
}
