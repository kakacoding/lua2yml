import * as commentsData from "./comments_data"
import * as fs from "fs";
import * as ejs from "ejs";
import * as path from "path";

export function analyseComment<T extends commentsData.IComment>(comment: string, cfg: any, type: (new () => T)) {
    let tp = new type()
    let reg = cfg[tp.head];
    let ret_match = comment.match(new RegExp(reg["regexp"]));

    reg["elems"].every((elem, idx) => {
        if (ret_match != null) {
            if (ret_match[idx + 1] != undefined) {
                tp[elem] = ret_match[idx + 1];
            }
            return true;
        }
    });

    let ret: [boolean, T] = [ret_match != null, tp]
    return ret;
}

export function getCommentRange(rangeBegin: number, rangeEnd: number, comments: Array<Object>): [number, number] {
    let ret: [number, number] = [0, 0]
    for (let i = comments.length - 1; i >= 0; --i) {
        let row = comments[i]["loc"]["start"]["line"]
        if (row == rangeEnd) {
            ret[1] = i;
        } else if (row >= rangeBegin && row < rangeEnd) {
            if (ret[1] == 0) {
                break;
            } else {
                if (row == comments[i + 1]["loc"]["start"]["line"] - 1) {
                    ret[0] == i;
                }
                else {
                    break;
                }
            }
        } else if (row < rangeBegin) {
            ret[0] = i + 1;
            break;
        }
    }
    return ret;
}

export function try2mkdir(dirpath: string) {
    let list = [dirpath];
    while (true) {
        if (list.length == 0) break;
        let dir = list.pop() as string;
        if (!fs.existsSync(dir)) {
            let parent = path.dirname(dir);
            if (fs.existsSync(parent)) {
                fs.mkdirSync(dir);
            }
            else {
                list.push(dir);
                list.push(parent);
            }
        }
    }
};

//通过ejs模板渲染文件
export function render(fileName: string, ejsName: string, data: {}, ejsPath: string, outPath: string) {
    let ejsFilePath = path.join(ejsPath, ejsName);
    let temp = fs.readFileSync(ejsFilePath, { encoding: 'utf-8' });
    let content = ejs.render(temp, data, { compileDebug: true });
    let outFilePath = path.join(outPath, fileName);
    try2mkdir(path.dirname(outFilePath));
    fs.writeFileSync(outFilePath, content, { encoding: 'utf-8' });
    console.log(path.resolve(outFilePath));
}
