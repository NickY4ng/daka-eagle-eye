export const tools = {};
tools.formatDate = function (date, format = "yyyy-MM-dd hh:mm:ss") {
    if (date && date instanceof Date && !isNaN(date.getDate())) {
        const o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    } else {
        return "";
    }
};

tools.createUUID = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

tools.tryJSON = function (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.log('无法解析json',str);
        return null;
    }
};

const promiseMap = {};

const promiseCreator = {
    create(fn) {
        const uuid = tools.createUUID().replace(/-/g, '');
        return new Promise((resolve, reject) => {
            fn(uuid);
            promiseMap[uuid] = {resolve, reject};
        });
    },
    resolve(uuid, result) {
        if (promiseMap[uuid]) {
            promiseMap[uuid].resolve(result);
            delete promiseMap[uuid];
        }
    },
    reject(uuid, error) {
        if (promiseMap[uuid]) {
            promiseMap[uuid].reject(error);
            delete promiseMap[uuid];
        }
    }
};
export {promiseCreator};
