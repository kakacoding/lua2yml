# lua2yml说明
基于typescript开发，使用luaparse库解析lua代码及注释，通过ejs模板生成docfx可使用的yml

抽取的lua注释格式以[emmylua](https://emmylua.github.io/annotations/class.html)为基础

## 运行方法
- `npm install`
- `tsc`
- `node ./dist/app.js`

## 配置文件
- `./conf/config.json`

## 其他
- lua的注释抽取是通过`config.json`中的正则实现的
- lua代码的分析目前不可配置，写死在app.ts中
- lua的类声明目前只支持tolua中的class格式`derive = class("derive"[,base])`，逻辑在`分析类声明`附近
- 类似`local c = {} function c.xx() end`的函数声明目前不支持
- 目前只用于测试，没在实际项目中使用

## 后续计划
- 实现代码分析可配置