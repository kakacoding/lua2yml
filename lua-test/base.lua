----------------------------------------------------------------------------
-- base module.
--
-- Copyright (C) 2018-2019 kakacoding Games CO., LTD. All rights reserved.
----------------------------------------------------------------------------
-- 描述这个文件或模块是干什么的，比如“这个模块是用来展
-- 示文件头格式的”，需保证用任何字体也不要超过线
----------------------------------------------------------------------------

---@class base @这是一个基类
---@field public num number @基类的数字
---@field public name string @基类的名字
base = class("base")

---基类的构造函数
function base:ctor()
    self.num = 2018
    self.name = "kakacoding"
end--hahah
---得到基类的数字
---@param num number @传入数字
---@return number @得到数字
---@public
function base:getNum(num)
    return self.num+num
end

---测试用的私有函数
---@private
function base:_getPrivate()
end