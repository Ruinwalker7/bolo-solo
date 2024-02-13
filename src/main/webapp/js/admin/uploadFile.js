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
 */

/* upload-file 相关操作 */
admin.uploadFile = {
    uploadMarkdown: function (file){
        var formData = new FormData();
        formData.append('file', file);
        console.log(file)
        console.log(formData)
        $.ajax({
            url: '/console/upload/markdown',
            type: 'POST',
            data: formData,
            processData: false, // 告诉jQuery不要处理发送的数据
            contentType: false, // 告诉jQuery不要设置内容类型
            success: function(data) {
                alert('File uploaded successfully');
            },
            error: function() {
                alert('File upload failed');
            }
        });
    },

    init: function (Page) {
        let dropZoneMultiOriginalText = '点击或在此区域拖拽图片以上传'; // 保存原始背景文字
        $('#single_upload').change(function(event) {

            if (this.files.length > 0) {
                var fileData = this.files[0];
                // let file = this.files[0];
                console.log(this.files)
                console.log(fileData)
                if (fileData.type !== 'text/markdown' && !fileData.name.endsWith('.md')) {
                    alert('请上传.md文件！');
                    this.value = ''; // 清除选中的文件
                }
                else{
                    admin.uploadFile.uploadMarkdown(fileData);
                    }
                }
        });

        let dropZoneMulti = $('#drop_zone_multi');

        dropZoneMulti.on('dragover', function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        dropZoneMulti.on('dragenter', function(event) {
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        dropZoneMulti.on('dragleave', function(event) {
            this.textContent = dropZoneMultiOriginalText; // 恢复原始背景文字
        });

        dropZoneMulti.on('drop', function(event) {
            event.preventDefault();
            this.textContent = dropZoneMultiOriginalText; // 恢复原始背景文字
            let files = event.dataTransfer.files;
            admin.uploadFile.uploadPictures(files);
        });

        $('#multi_upload').change(function(event) {
            admin.uploadFile.uploadPictures(this.files);
        });
    },
    uploadPictures: function(files){
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!file.type.startsWith('image/')) {
                alert('仅支持图片文件！');
                continue;
            }
            let li = document.createElement('li');
            li.textContent = file.name;
            $('#file_list_multi').appendChild(li);
        }
    }
}

/*
 * 注册到 admin 进行管理
 */
admin.register['upload-file'] = {
    'obj': admin.uploadFile,
    'init': admin.uploadFile.init,
}
// 'refresh': admin.uploadFile.init,