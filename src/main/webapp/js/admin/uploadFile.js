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
    name:'',
    init: function (Page) {
        let dropZoneMultiOriginalText = '点击或在此区域拖拽图片以上传'; // 保存原始背景文字
        $('#single_upload').change(function() {
            if (this.files.length > 0) {
                var fileData = this.files[0];
                if (fileData.type !== 'text/markdown' && !fileData.name.endsWith('.md')) {
                    alert('请上传.md文件！');
                    this.value = ''; // 清除选中的文件
                }
                else{
                    admin.uploadFile.uploadMarkdown(fileData);
                    }
                }
        });

        $('#drop_zone_single').click(function(){
            $('#single_upload').click(); // 触发文件输入的点击事件
        });

        $('#drop_zone_single').on('dragover', function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        $('#drop_zone_single').on('dragenter', function(event) {
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        $('#drop_zone_single').on('dragleave', function(event) {
            this.textContent = dropZoneMultiOriginalText; // 恢复原始背景文字
        });

        $('#drop_zone_single').on('drop', function(event) {
            event.preventDefault();
            this.textContent = dropZoneMultiOriginalText; // 恢复原始背景文字
            // let files = event.dataTransfer.files;
            var files = event.originalEvent.dataTransfer.files; // 获取文件列表

            // 检查是否是单个Markdown文件
            if(files.length === 1 && files[0].name.endsWith('.md')) {
                // 进行文件上传操作
                console.log("准备上传文件：", files[0].name);
                admin.uploadFile.uploadMarkdown(files[0]);
            } else {
                alert("请拖拽单个Markdown文件！");
            }

        });


        $('#drop_zone_multi').click(function(){
            $('#multi_upload').click(); // 触发文件输入的点击事件
        });
        $('#drop_zone_multi').on('dragover', function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        $('#drop_zone_multi').on('dragenter', function(event) {
            this.textContent = '释放以上传文件'; // 改变背景文字
        });

        $('#drop_zone_multi').on('dragleave', function(event) {
            this.textContent = dropZoneMultiOriginalText; // 恢复原始背景文字
        });

        $('#drop_zone_multi').on('drop', function(event) {
            event.preventDefault();
            this.textContent = dropZoneMultiOriginalText;
            var files = event.originalEvent.dataTransfer.files;
            admin.uploadFile.uploadPictures(files);
        });

        $('#multi_upload').change(function() {
            admin.uploadFile.uploadPictures(this.files);
        });

    },
    uploadMarkdown: function (file){
        var formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: '/console/upload/markdown',
            type: 'POST',
            data: formData,
            processData: false, // 告诉jQuery不要处理发送的数据
            contentType: false, // 告诉jQuery不要设置内容类型
            success: function() {
                admin.uploadFile.name = file.name;
                $('#drop_zone_single').hide(); // 隐藏拖拽区域
                $('#fileName').text(file.name); // 设置文件名
                $('#uploadSuccess').show(); // 显示上传成功信息
                $('#startC').show();
            },
            error: function() {
                alert('File upload failed');
            }
        });
    },
    uploadPictures: function(files){
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!file.type.startsWith('image/')) {
                alert('仅支持图片文件！');
                continue;
            }
            let formData = new FormData();
            for (var j = 0; j < files.length; j++) {
                formData.append("files[]", files[j]); // 添加文件到FormData
            }

            $.ajax({
                url: '/console/upload/pictures',
                type: 'POST',
                data: formData,
                processData: false, // 告诉jQuery不要处理发送的数据
                contentType: false, // 告诉jQuery不要设置内容类型
                success: function(res) {
                    if(res.code!=-1){
                        res.rslts.forEach(function(item) {
                            admin.uploadFile.addImage("/markdowns/assets/"+item,item)
                        });
                    }
                },
                error: function() {
                    alert('连接服务器失败！');
                }
            });
        }
    },
    showDiv: function (){
        $.ajax({
            url: '/console/upload/clean',
            type: 'GET',
            processData: false, // 告诉jQuery不要处理发送的数据
            contentType: false, // 告诉jQuery不要设置内容类型
            success: function() {
                $('#startC').hide();
                $("#uploadDiv").show();
                if($('#imagesURLInput').val()=='')
                    $('#imagesURLInput').val('./assets/');
                $('#imagesURLInput').prop('disabled', true);
                $("#confirmBtn").hide();
                $('#drop_zone_single').show(); // 隐藏拖拽区域
                $('#uploadSuccess').hide(); // 显示上传成功信息
            },
            error: function() {
                alert('连接服务器失败！');
            }
        });
    },
    addImage: function(imageSrc, imageName) {
        const container = document.getElementById('imageContainer');

        // 创建图片元素
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = imageName;

        // 创建文件名文本
        const name = document.createElement('div');
        name.classList.add('image-name');
        name.textContent = imageName;

        // 创建包含图片和文件名的盒子
        const imageBox = document.createElement('div');
        imageBox.classList.add('image-box');
        imageBox.appendChild(img);
        imageBox.appendChild(name);

        // 将盒子添加到容器中
        container.appendChild(imageBox);
    },
    refresh: function (){
        $('#imagesURLInput').prop('disabled', false);
        $('#imagesURLInput').val('');
        $("#uploadDiv").hide();
        $("#confirmBtn").show();
        $("#imageContainer").empty();
    },
    startConv: function (){
        $.ajax({
            url: '/console/deal/markdown',
            type: 'POST',
            data:{
                url: $("#imagesURLInput").val()
            },
            success: function(res) {
                if(res.code === 0){
                    console.log(res.data.articles)
                    console.log(res.data.articles[0])
                    admin.uploadFile.downloadMarkdown(res.data.articles[0], admin.uploadFile.name);
                    admin.uploadFile.refresh();
                }
            },
            error: function() {
                alert('转换失败！');
            }
        });
    },
    downloadMarkdown: function (markdownContent, fileName) {
        // 将字符串转换为Blob
        var blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });

        // 创建一个隐藏的可下载链接
        var downloadLink = document.createElement("a");
        downloadLink.style.display = "none";
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName; // 设定下载文件名

        // 将链接添加到DOM中
        document.body.appendChild(downloadLink);

        // 触发下载
        downloadLink.click();

        // 清理并移除创建的链接
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href); // 释放通过URL.createObjectURL()创建的URL
    },
}

/*
 * 注册到 admin 进行管理
 */
admin.register['upload-file'] = {
    'obj': admin.uploadFile,
    'init': admin.uploadFile.init,
    'refresh': admin.uploadFile.refresh,
}