----------------------------------------------------------------------------
-- derive module.
--
-- Copyright (C) 2018-2019 kakacoding Games CO., LTD. All rights reserved.
----------------------------------------------------------------------------
-- 描述这个文件或模块是干什么的，比如“这个模块是用来展
-- 示文件头格式的”，需保证用任何字体也不要超过线
----------------------------------------------------------------------------
require "base"

---@class derive:base @这是一个派生类
---@field public age number @这是派生类的年龄
---@field public name string @这是派生类的名字
derive = class("derive", base)

---派生类的构造函数
---派生类的构造函数的第二行注释
---@private
function derive:ctor()
    self.super:ctor()
    self.age = 11
    self.name = "jaja"
end

---一个有参数的派生类的函数
---@public
---@param p1 number @数字参数
---@param p2 string @字符串参数
---@return number|string @得到数字|得到字符串
function derive:getParam(p1, p2)
    return p1, p2
end

---派生类的静态函数
---@public
function derive.staticfunc()

end

---派生类的local函数
---@private
local function ss()
    print("11111")
end

---@type table @派生类的静态成员变量,由于关键字很多，这个先不处理了
derive.xx = {}


---派生类的得到数字的函数
---@public
---@return number @得到数字
---派生类的得到数字的函数，第二行注释
function derive:getAge()
    return self.age
end

---一个返回基类数字加100的函数
---@public
---@return number @得到数字
function derive:getNum()
    return self.super:getNum(100)
end

---@class der2:base @这是一个派生类2
---@field public age2 number @这是派生类的年龄2
der2 = class("der2", base)

---派生类的构造函数2
---@private
function der2:ctor()
    self.super:ctor()
    self.age2 = 11
end

---一个得到派生类数字的函数2
---@public
---@return number @得到数字2
function der2:getAge2()
    return self.age2
end


---derive中的全局函数1
---@public
---@param p1 number @数字参数
---@param p2 string @字符串参数
---@return number|string @得到数字|得到字符串
function derive_func1(p1, p2)
    return p1, p2
end
