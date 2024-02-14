<#--

    Bolo - A stable and beautiful blogging system based in Solo.
    Copyright (c) 2020, https://github.com/adlered

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

-->

<div class="form fn__margin12 ">
    <label>图片路径（要替换的本地路径）：</label>
    <div class="confirmDiv">
        <input type="text" id="imagesURLInput" placeholder="默认为'./assets/'">
        <button onclick="admin.uploadFile.showDiv()" id="confirmBtn">确定</button>
    </div>
</div>

<div id="uploadDiv"  style="display: none;">
    <div class="upload-section">
        <h2>博客文件上传 (.md)</h2>
        <input type="file" id="single_upload" accept=".md"  style="display: none;">
        <div id="drop_zone_single">点击或拖拽文件到此区域以上传</div>
        <div id="uploadSuccess" style="display: none; text-align: center;">
            <img id="uploadedImage" src="/images/markdown.png" style="max-width: 80%; width:100px;margin: 0 auto; display: block;">
            <p id="fileName" style="font-size: 16px"></p>
        </div>
        <ul id="file_list_multi"></ul>
    </div>

    <div class="upload-section" id="multi_upload_area">
        <h2>图片文件上传</h2>
        <input type="file" id="multi_upload" accept="image/*" multiple style="display: none;">
        <div class="image-container" id="imageContainer"></div>
        <div id="drop_zone_multi">点击或在此区域拖拽图片以上传</div>
        <ul id="file_list_multi"></ul>
    </div>

    <div class="fn__right">
        <button class="marginRight12" id="1111111111">开始转换</button>
    </div>

    <div class="fn__clear"></div>
</div>



${plugins}
