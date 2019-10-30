/**
 * 定义一些通用方法
 */

//数组去重
export function getFilterArray(array) {
    const res = []
    const json = {}
    for (let i = 0; i < array.length; i++) {
        let _self = array[i]
        if (!json[_self]) {
            res.push(_self)
            json[_self] = 1
        }
    }
    return res
}