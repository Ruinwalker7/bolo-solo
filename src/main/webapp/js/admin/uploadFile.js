/*
 * Bolo - A stable and beautiful blogging system based in Solo.
 * Copyright (c) 2020, https://github.com/adlered
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * upload local file with images
 *
 */

/* upload-file 相关操作 */
admin.uploadFile = {
    init: function (Page) {
        let dropZoneMultiOriginalText = '或在此区域拖拽图片以上传'; // 保存原始背景文字
        document.getElementById('single_upload').addEventListener('change', function(event) {
            if (this.files.length > 0) {
                let file = this.files[0];
                if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
                    alert('请上传.md文件！');
                    this.value = ''; // 清除选中的文件
                }
            }
        });

        let dropZoneMulti = document.getElementById('drop_zone_multi');
        let fileListMulti = document.getElementById('file_list_multi');

        dropZoneMulti.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });

        dropZoneMulti.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        dropZoneMulti.addEventListener('dragenter', function(event) {
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        dropZoneMulti.addEventListener('dragleave', function(event) {
            this.textContent = dropZoneMultiOriginalText; // 恢复原始背景文字
        });

        dropZoneMulti.addEventListener('drop', function(event) {
            event.preventDefault();
            this.textContent = dropZoneMultiOriginalText; // 恢复原始背景文字
            let files = event.dataTransfer.files;
            processFiles(files);
        });

        document.getElementById('multi_upload').addEventListener('change', function(event) {
            processFiles(this.files);
        });

        function processFiles(files) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (!file.type.startsWith('image/')) {
                    alert('仅支持图片文件！');
                    continue;
                }
                let li = document.createElement('li');
                li.textContent = file.name;
                fileListMulti.appendChild(li);
            }
        }
    },
}

/*
 * 注册到 admin 进行管理
 */
admin.register['upload-file'] = {
    'obj': admin.uploadFile,
    'init': admin.uploadFile.init,
}
// 'refresh': admin.uploadFile.init,