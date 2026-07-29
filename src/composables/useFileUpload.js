/**
 * Created by claude on 2026/6/22
 * 文件上传 composable — 文件校验、选中管理、客户端读取
 */
import {ref, computed} from 'vue';

/** 允许上传的文件后缀 */
const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];
/** 允许的 MIME 类型（兜底） */
const ACCEPTED_MIMES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
];
/** 单文件最大 10MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getExtension(name) {
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

function isAccepted(file) {
    const ext = getExtension(file.name);
    if (ext && ACCEPTED_EXTENSIONS.includes(ext)) return true;
    // MIME 兜底 — 某些环境下 .csv 可能是 application/csv 等
    if (ACCEPTED_MIMES.includes(file.type)) return true;
    return false;
}

export const useFileUpload = () => {
    /** @type {import('vue').Ref<Array<{id:string, file:File, name:string, size:number, status:string, url?:string, error?:string}>>} */
    const selectedFiles = ref([]);

    const hasFiles = computed(() => selectedFiles.value.length > 0);
    const allUploaded = computed(() =>
        selectedFiles.value.length > 0 && selectedFiles.value.every(f => f.status === 'uploaded'),
    );

    /**
     * 校验并添加文件（按名称去重）
     * @param {FileList|File[]} fileList
     * @returns {string[]} 警告消息列表（可直接展示或忽略）
     */
    function validateAndAddFiles(fileList) {
        if (!fileList || fileList.length === 0) return [];
        const warnings = [];
        const existingNames = new Set(selectedFiles.value.map(f => f.name));

        for (const file of fileList) {
            if (!isAccepted(file)) {
                warnings.push(`"${file.name}" 格式不支持，仅允许 .xlsx / .xls / .csv`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                warnings.push(`"${file.name}" 超过 10MB 限制`);
                continue;
            }
            if (existingNames.has(file.name)) {
                continue; // 静默去重
            }
            existingNames.add(file.name);
            selectedFiles.value.push({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 11),
                file,
                name: file.name,
                size: file.size,
                status: 'pending',
            });
        }
        return warnings;
    }

    /** 移除指定文件 */
    function removeFile(id) {
        selectedFiles.value = selectedFiles.value.filter(f => f.id !== id);
    }

    /** 清空全部已选文件 */
    function clearFiles() {
        selectedFiles.value = [];
    }

    /**
     * 客户端读取文件内容（无需上传，直接传给 LLM）
     * CSV → 文本内容；XLSX → 暂解析为提示信息
     * @returns {Promise<Array<{name: string, content: string}>>}
     */
    async function readFileContents() {
        const results = [];
        for (const f of selectedFiles.value) {
            try {
                const content = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error(`读取失败: ${f.name}`));
                    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf('.'));
                    if (ext === '.csv') {
                        // CSV 直接读文本
                        reader.readAsText(f.file, 'UTF-8');
                    } else if (ext === '.xlsx' || ext === '.xls') {
                        // Excel 文件：暂不支持直接解析，标记文件名
                        // TODO: 可引入 xlsx 库解析表格内容
                        resolve(`[Excel 文件: ${f.name}，大小: ${(f.size / 1024).toFixed(1)}KB。请使用 xlsx 库解析或转换为 CSV 后读取。]`);
                    } else {
                        reader.readAsText(f.file, 'UTF-8');
                    }
                });
                results.push({name: f.name, content});
            } catch (err) {
                console.warn(`[FileUpload] 读取文件失败: ${f.name}`, err);
            }
        }
        return results;
    }

    return {
        selectedFiles,
        hasFiles,
        allUploaded,
        validateAndAddFiles,
        removeFile,
        clearFiles,
        readFileContents,
        ACCEPTED_EXTENSIONS,
    };
};
