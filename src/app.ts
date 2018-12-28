import minify = require("jsonminify")
import * as fs from "fs";
import * as rd from "rd";
import * as luaparse from "luaparse";
import * as commentsData from "./modules/comments_data"
import * as analyse from "./modules/analyse"
import * as codedata from "./modules/code_data";

//读取配置
let cfg = JSON.parse(minify(fs.readFileSync("./conf/config.json", { encoding: 'utf-8' }).toString()));
let ymloutdir = cfg["ymloutdir"];
let commentsRegexp = cfg["regexp"]["comments"];
let defaultClassName = cfg["defaultClassName"];
let displayNoPublic = cfg["displayNoPublic"];
let luafiles = cfg["luafiles"];

//声明类的map，并初始化全局类
let classMap: { [key: string]: codedata.CodeClass } = {};
classMap[defaultClassName] = new codedata.CodeClass(defaultClassName, "", defaultClassName);
classMap[defaultClassName].comment = cfg["defaultClassComment"]

//统计要分析的lua文件
let luaFiles: string[] = [];
for (let dir of luafiles["include"]) {
    let arr = rd.readFileFilterSync(dir, (name: string) => { return name.toLowerCase().endsWith(".lua"); });
    luaFiles = luaFiles.concat(arr);
}
for (let dir of luafiles["exclude"]) {
    let arr = rd.readFileFilterSync(dir, (name: string) => { return name.toLowerCase().endsWith(".lua"); });
    for (let i = 0; i < arr.length; ++i) {
        for (let j = 0; j < luaFiles.length; ++j) {
            if (luaFiles[j] == arr[i]) {
                luaFiles.splice(j, 1);
                j = j - 1;
            }
        }
    }
}

luaFiles.every((file) => {
    console.log(`开始分析 -- ${file}`);
    let blockBegin = 1;
    //读取代码生成语法树
    let syntaxTree = luaparse.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString(), { locations: true, comments: true, scope: true });
    //分析语法树，block为每个代码块
    syntaxTree["body"].every((block) => {
        //得到注释块，返回的是语法树中注释数组的idx范围
        let commentRange = analyse.getCommentRange(blockBegin, block["loc"]["start"]["line"] - 1, syntaxTree["comments"])
        //赋值类型，可能是类的声明，变量的声明，目前只处理类声明
        if (block["type"] == "AssignmentStatement") {
            //分析类声明
            if (block["init"][0]["type"] == "CallExpression"
                && block["init"][0]["base"]["name"] == "class") {
                let classname = block["variables"][0]["name"];
                let basename = block["init"][0]["arguments"].length > 1 ? block["init"][0]["arguments"][1]["name"] : ""
                let declaration = basename == "" ? `${classname} = class("${classname}")` : `${classname} = class("${classname}", ${basename})`;
                if (classMap[classname] == null) {
                    //类名，基类名,以代码为准
                    classMap[classname] = new codedata.CodeClass(classname, basename);
                    classMap[classname].ymlDeclaration = declaration;
                    //!
                    classMap[classname].pushRefrence(basename);
                } else {
                    throw new Error(`===error:可能有重复的class名${classname} ${file}`);
                }

                for (let idx = commentRange[0]; idx != 0 && idx <= commentRange[1]; ++idx) {
                    let comment = syntaxTree["comments"][idx]["raw"];
                    {
                        let ret = analyse.analyseComment(comment, commentsRegexp, commentsData["CommentClass"])
                        if (ret[0]) {
                            if (classMap[classname].name == ret[1].name) {
                                //类注释
                                classMap[classname].comment = ret[1].comment;
                            }
                            continue;
                        }
                    }
                    //类成员变量，以注释为准
                    {
                        let ret = analyse.analyseComment(comment, commentsRegexp, commentsData["CommentField"]);
                        if (ret[0]) {
                            //分析field
                            let field = new codedata.CodeField();
                            field.comment = ret[1].comment;
                            field.name = ret[1].name;
                            field.type = ret[1].type;
                            field.access = codedata.EAccess[ret[1].access];
                            classMap[classname].fields.push(field);
                            //!
                            classMap[classname].pushRefrence(field.type);
                            continue;
                        }
                    }
                }
            }
            //分析变量声明
            else {
            }
        }
        //分析函数，以代码为准
        else if (block["type"] == "FunctionDeclaration") {
            if (!block["isLocal"]) {
                let bs = block["identifier"]["base"];
                let base = bs != null ? block["identifier"]["base"]["name"] : defaultClassName;
                let name = bs != null ? block["identifier"]["identifier"]["name"] : block["identifier"]["name"];
                let indexer = block["identifier"]["indexer"] != null ? block["identifier"]["indexer"] : ".";
                //本类的成员函数
                if (classMap[base] != null) {
                    let func = new codedata.CodeFunc();
                    classMap[base].funcs.push(func);

                    //类成员函数名和所属类，以代码为准
                    func.isLocal = block["isLocal"];
                    func.base = base;
                    func.name = name;
                    func.indexer = indexer;
                    //从代码中导入所有函数参数
                    let params = ""
                    for (let i = 0; i < block["parameters"].length; ++i) {
                        let param = new codedata.CodeParam();
                        param.name = block["parameters"][i]["name"]
                        func.params.push(param);
                        if (i == 0) {
                            params += param.name;
                        } else {
                            params += ", " + param.name;
                        }
                    }
                    //函数declare
                    if (func.base == defaultClassName) {
                        func.ymlDeclaration = `${func.name}(${params})`
                    } else {
                        func.ymlDeclaration = `${func.base}${func.indexer}${func.name}(${params})`
                    }

                    for (let idx = commentRange[0]; idx != 0 && idx <= commentRange[1]; ++idx) {
                        let comment = syntaxTree["comments"][idx]["raw"];
                        //函数access，以注释为准
                        {
                            let ret = analyse.analyseComment(comment, commentsRegexp, commentsData["CommentAccess"])
                            if (ret[0]) {
                                func.access = codedata.EAccess[ret[1].access]
                                continue;
                            }
                        }
                        //函数参数,以代码为准
                        {
                            let ret = analyse.analyseComment(comment, commentsRegexp, commentsData["CommentParam"])
                            if (ret[0]) {
                                let param = func.params.find((value) => { return value.name == ret[1].name; })
                                if (param != null) {
                                    param.comment = ret[1].comment;
                                    param.type = ret[1].type;
                                    //!
                                    classMap[base].pushRefrence(param.type);
                                }
                                continue;
                            }
                        }
                        //函数返回值，以注释为准，因为代码可能返回不同的值
                        {
                            let ret = analyse.analyseComment(comment, commentsRegexp, commentsData["CommentReturn"])
                            if (ret[0]) {
                                // //多返回值分开，docfx不支持
                                // let coderets = ret[1].type.replace(" ", "").split("|");
                                // let coderetcomments = ret[1].comment.split("|");
                                // for (let i = 0; i < coderets.length; ++i) {
                                //     let codereturn = new codedata.CodeReturn();
                                //     codereturn.type = coderets[i];
                                //     codereturn.comment = coderetcomments.length > i ? coderetcomments[i] : "";
                                //     func.rets.push(codereturn);
                                //     //!
                                //     classMap[base].pushRefrence(codereturn.type);
                                // }
                                let codereturn = new codedata.CodeReturn();
                                codereturn.type = ret[1].type;
                                codereturn.comment = ret[1].comment;
                                func.rets.push(codereturn);
                                //!
                                classMap[base].pushRefrence(codereturn.type);
                                continue;
                            }
                        }

                        //函数注释
                        {
                            let ret = analyse.analyseComment(comment, commentsRegexp, commentsData["CommentComment"])
                            func.comment += func.comment == "" ? ret[1].comment : " " + ret[1].comment;
                            continue;
                        }
                    }
                } else {
                    //还是有local xx={} functin xx.func() end的写法，这种先忽略掉
                    //throw new Error(`===error不太可能没有类${base}但有类成员函数${name}吧 ${file}`);
                    console.log(`没通过class()创建的类声明的函数 ${base}${indexer}${name}`);
                }
            } else if (block["isLocal"] && cfg["displayLocal"]) {
                throw new Error(`===error，没有导出local函数的逻辑 ${file}`);
            }
        }

        //重新赋值代码块起始点，方便确定下一个代码块的注释区域
        blockBegin = block["loc"]["end"]["line"] + 1;
        //let codeRegexp = cfg["regexp"]["code"];
        // Object.keys(codeRegexp).forEach(function(key){
        //     if(block["type"] == key){
        //         let types = codeRegexp[key]
        //         Object.keys(types).every((typeKey)=>{
        //             let elems = types[typeKey]["elems"];
        //             analyse["analyse"+type.toString()](block)
        //             return true;
        //         })
        //     }
        // })
        return true;
    });
    //console.log(`分析完毕 -- ${file}`);
    return true; // Continues
    // Return false will quit the iteration
});

//渲染总目录页
analyse.render("toc.yml", "toc.ejs", { classMap: classMap }, "./conf", ymloutdir);
console.log("目录渲染完毕");
//渲染类
for (let className in classMap) {
    let classData = {
        data: {
            classData: classMap[className],
            isDefaultClass: className == defaultClassName ? true : false,
            displayNoPublic: displayNoPublic
        }
    }
    analyse.render(`${className}.yml`, "class.ejs", classData, "./conf", ymloutdir);
}
console.log("类渲染完毕");
