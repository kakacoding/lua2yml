----------------------------------------------------------------------------
-- main module.
--
-- Copyright (C) 2018-2019 kakacoding Games CO., LTD. All rights reserved.
----------------------------------------------------------------------------
-- 描述这个文件或模块是干什么的，比如“这个模块是用来展
-- 示文件头格式的”，需保证用任何字体也不要超过线
----------------------------------------------------------------------------
require "class"
require "derive"

---@type derive
local test = derive.New()

local t2 = der2.New()


print(test:getAge())
print(test:getNum())

local test2 = base.New()

---main中的全局函数1
---@public
---@param p1 number @数字参数
---@param p2 string @字符串参数
---@return number|string @得到数字|得到字符串
function func1(p1, p2)
    return p1, p2
end

---main中的全局函数2
---@public
---@param p1 number @数字参数
---@param p2 string @字符串参数
---@return number|string @得到数字|得到字符串
function func2(p1, p2)
    return p1, p2
end


---main中的全局函数9
---@public
---@param d1 derive @数字参数
---@param d2 der2 @字符串参数
---@return derive|der2 @得到数字|得到字符串
function func9(d1, d2)
    return d1, d2
end

--print(test:getName())