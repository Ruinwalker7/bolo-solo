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

<div class="form fn__margin12">
    <input type="text" id="articleListInput">
    <button class="search-btn" id="articleListBtn">${searchLabel}</button>
</div>

<div class="upload-section">
    <h2>单文件上传 (.md文件)</h2>
    <input type="file" id="single_upload" accept=".md">
</div>

<div class="upload-section" id="multi_upload_area">
    <h2>多文件上传 (图片)</h2>
    <input type="file" id="multi_upload" accept="image/*" multiple>
    <div id="drop_zone_multi">或在此区域拖拽图片以上传</div>
    <ul id="file_list_multi"></ul>
</div>

<div class="fn__clear"></div>
${plugins}
