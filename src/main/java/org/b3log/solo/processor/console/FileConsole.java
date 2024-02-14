package org.b3log.solo.processor.console;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.b3log.latke.Keys;
import org.b3log.latke.ioc.Inject;
import org.b3log.latke.logging.Logger;
import org.b3log.latke.servlet.HttpMethod;
import org.b3log.latke.servlet.RequestContext;
import org.b3log.latke.servlet.annotation.Before;
import org.b3log.latke.servlet.annotation.RequestProcessing;
import org.b3log.latke.servlet.annotation.RequestProcessor;
import org.b3log.latke.servlet.renderer.JsonRenderer;
import org.b3log.solo.SoloServletListener;
import org.b3log.solo.bolo.pic.util.UploadUtil;
import org.b3log.solo.bolo.tool.DeleteFolder;
import org.b3log.solo.model.Option;
import org.b3log.solo.repository.OptionRepository;
import org.b3log.solo.util.Solos;
import org.json.JSONObject;
import org.zeroturnaround.zip.ZipUtil;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@RequestProcessor
@Before(ConsoleAdminAuthAdvice.class)
public class FileConsole {
    /**
     * Logger.
     */
    private static final Logger LOGGER = Logger.getLogger(FileConsole.class);
    /**
     * Option repository.
     */
    @Inject
    private OptionRepository optionRepository;

    @Before(ConsoleAdminAuthAdvice.class)
    public void uploadFile(final RequestContext context) {
        final ServletContext servletContext = SoloServletListener.getServletContext();
        final String markdownsPath = servletContext.getRealPath("/markdowns");
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setRepository(new File(markdownsPath));
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setHeaderEncoding("UTF-8");
        try {
            List<FileItem> itemList = upload.parseRequest(context.getRequest());
            for (FileItem item : itemList) {
                String name = item.getName();
                File file = new File(markdownsPath +"/"+ name);
                item.write(file);
                item.delete();
            }
        } catch (Exception e) {
            context.renderJSON().renderMsg("上传失败！");
            return;
        }
        context.renderJSON().renderMsg("上传成功！");
    }
    @Before(ConsoleAdminAuthAdvice.class)
    public void cleanDir(final RequestContext context) {
        final ServletContext servletContext = SoloServletListener.getServletContext();
        final String markdownsPath = servletContext.getRealPath("/markdowns");
        DeleteFolder.delAllFile(markdownsPath);
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setRepository(new File(markdownsPath));
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setHeaderEncoding("UTF-8");
        context.renderJSON().renderMsg("清除文件夹成功！");
    }

    @Before(ConsoleAdminAuthAdvice.class)
    public void uploadImages(final RequestContext context) {
        final ServletContext servletContext = SoloServletListener.getServletContext();
        final String markdownsPath = servletContext.getRealPath("/markdowns/assets/");
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setRepository(new File(markdownsPath));
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setHeaderEncoding("UTF-8");

        final JsonRenderer renderer = new JsonRenderer();
        context.setRenderer(renderer);
        final JSONObject jsonObject = new JSONObject();
        renderer.setJSONObject(jsonObject);

        try {
            ArrayList<String> list = new ArrayList<>();
            List<FileItem> itemList = upload.parseRequest(context.getRequest());
            for (FileItem item : itemList) {
                String name = item.getName();
                File file = new File(markdownsPath , name);
                if (!file.getParentFile().exists()) {
                    file.getParentFile().mkdirs();
                }
                if(!file.exists()){
                    item.write(file);
                    list.add(name);
                }
                item.delete();
            }
            jsonObject.put(Keys.RESULTS,list);
        } catch (Exception e) {
            jsonObject.put(Keys.CODE,-1);
            return;
        }
        jsonObject.put(Keys.MSG,"上传成功！");
    }

    @Before(ConsoleAdminAuthAdvice.class)
    public void dealMarkdown(final RequestContext context) {
        final ServletContext servletContext = SoloServletListener.getServletContext();
        HttpServletRequest request = context.getRequest();
        String value = request.getParameter("url");
        final String markdownsPath = servletContext.getRealPath("/markdowns");
        Map okPic = new HashMap();
        List<String> errFiles = new ArrayList<>();
        List<String> articles = new ArrayList<>();
//        String regex = Pattern.quote(value);
        String regex = escapeSpecialRegexChars(value);
        try (Stream<Path> paths = Files.walk(Paths.get(markdownsPath))) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> path.toString().endsWith(".md"))
                    .forEach(mdFilePath -> {
                                try {
                                    String content = new String(Files.readAllBytes(Paths.get(mdFilePath.toString())));
                                    String s = regex+"(\\S+?\\.(jpg|png|svg|gif|bmp|ico|tiff))";
//                                    Pattern pattern = Pattern.compile("\\.\\/assets\\/(\\S+?\\.(jpg|png|svg|gif|bmp|ico|tiff))");

                                    Pattern pattern = Pattern.compile(s);
                                    System.out.println("Escaped regex: " + s);
                                    Matcher matcher = pattern.matcher(content);

                                    while (matcher.find()) {
                                        String matchedString = matcher.group(0);
                                        String fileName = matcher.group(1);
                                        File file = new File(markdownsPath+"/assets/", fileName);
                                        if (file.exists()) {
                                            String name = file.getName();
                                            String config;
                                            try {
                                                config = optionRepository.get(Option.ID_C_TUCHUANG_CONFIG).optString(Option.OPTION_VALUE);
                                            } catch (Exception e) {
                                                config = "hacpai";
                                            }
                                            try {
                                                String url = UploadUtil.upload(config, file);
                                                if (url.isEmpty()) {
                                                    url = "接口调用错误，请检查偏好设置-自定义图床配置，清除浏览器缓存并重启服务端。";
                                                }
                                                okPic.put(name, url);
                                                content = content.replace(matchedString, url);
                                            } catch (Exception e) {
                                                errFiles.add(name);
                                            }

                                        }
                                    }
                                    articles.add(content);
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                    );
        } catch (IOException e) {
            e.printStackTrace();
        }

        Map map = new HashMap();
        map.put("succMap", okPic);
        map.put("errFiles", errFiles);
        map.put("articles", articles);
        context.renderJSON().renderData(map);
        if(articles.size()==0){
            context.renderCode(-1);
        }else
            context.renderCode(0);
        context.renderMsg("");
    }

    private static Pattern SPECIAL_REGEX_CHARS = Pattern.compile("[{}()\\[\\].+*?^$\\\\|]");

    public static String escapeSpecialRegexChars(String str) {
        return SPECIAL_REGEX_CHARS.matcher(str).replaceAll("\\\\$0");
    }
}
