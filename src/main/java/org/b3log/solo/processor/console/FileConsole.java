package org.b3log.solo.processor.console;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.b3log.latke.logging.Logger;
import org.b3log.latke.servlet.HttpMethod;
import org.b3log.latke.servlet.RequestContext;
import org.b3log.latke.servlet.annotation.Before;
import org.b3log.latke.servlet.annotation.RequestProcessing;
import org.b3log.latke.servlet.annotation.RequestProcessor;
import org.b3log.solo.SoloServletListener;
import org.b3log.solo.bolo.tool.DeleteFolder;
import org.b3log.solo.util.Solos;
import org.zeroturnaround.zip.ZipUtil;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.util.List;

@RequestProcessor
@Before(ConsoleAdminAuthAdvice.class)
public class FileConsole {
    /**
     * Logger.
     */
    private static final Logger LOGGER = Logger.getLogger(FileConsole.class);

    @Before(ConsoleAdminAuthAdvice.class)
    public void uploadFile(final RequestContext context) {
        final ServletContext servletContext = SoloServletListener.getServletContext();
        final String markdownsPath = servletContext.getRealPath("/markdowns");
        DeleteFolder.delAllFile(markdownsPath);
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
    public void uploadImages(final RequestContext context) {
        final ServletContext servletContext = SoloServletListener.getServletContext();
        final String markdownsPath = servletContext.getRealPath("/markdowns/asserts/");
        DeleteFolder.delAllFile(markdownsPath);
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
}
