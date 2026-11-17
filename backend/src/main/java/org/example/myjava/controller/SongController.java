package org.example.myjava.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.example.myjava.common.Result;
import org.example.myjava.entity.Song;
import org.example.myjava.service.SongService;

import org.example.myjava.vo.SongVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 歌曲资源接口。
 * <p>URL 规范：
 * <ul>
 *   <li>资源名用复数名词：/api/songs（原 /api/song 是单数，改为复数）</li>
 *   <li>单个资源用路径变量定位：/api/songs/{songId}</li>
 *   <li>列表分页用 query 参数：/api/songs?page=1</li>
 *   <li>个人网站前后端同发，不引入 API 版本号；将来对外提供 API 时再加 /v1</li>
 * </ul>
 * 接口清单：
 * <pre>
 * GET /api/songs?page=1    分页获取歌曲列表（每页固定 10 首）
 * GET /api/songs/{songId}  获取单首歌曲
 * </pre>
 */
@RestController
@RequestMapping("/api/songs")
public class SongController {

    @Autowired
    private SongService songService;

    /**
     * 分页获取歌曲列表：GET /api/songs?page=1
     * <p>列表用 query 参数而不是路径变量：路径变量已经被 /{songId} 占用，
     * 两个接口都写路径变量会变成同一个 URL 模式，Spring 无法按变量名区分。
     * <p>页码从 1 开始，缺省为 1；Service 内部会把小于 1 的页码按 1 处理。
     */
    @GetMapping
    public Result<Page<Song>> getSongList(@RequestParam(defaultValue = "1") long page) {
        return Result.ok(songService.getSongList(page));
    }

    /**
     * 获取单首歌曲：GET /api/songs/{songId}
     * <p>用路径变量而不是 query 参数，资源 id 直接体现在 URL 里；
     * id 缺失 / 不是数字时 Spring 会自动返回 4xx，不用再在业务里判空。
     */
    @GetMapping("/{songId}")
    public Result<SongVO> getSong(@PathVariable Long songId) {
        return Result.ok(new SongVO(songService.getSong(songId)));
    }
}
