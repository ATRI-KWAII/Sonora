package org.example.myjava.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.example.myjava.entity.Song;
import org.example.myjava.mapper.SongMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SongService {

    /** 每页固定 10 首（需求：列表不超过十首） */
    private static final long PAGE_SIZE = 10;

    @Autowired
    private SongMapper songMapper;

    public Song getSong(Long songId) {
        QueryWrapper<Song> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("song_id", songId);

        return songMapper.selectOne(queryWrapper);
    }

    /**
     * 分页查询歌曲列表。
     *
     * @param pageNo 页码，从 1 开始；小于 1 时按第 1 页处理
     * @return 当前页数据 + 总数 / 总页数等分页信息
     */
    public Page<Song> getSongList(long pageNo) {
        return songMapper.selectPage(
                Page.of(Math.max(pageNo, 1), PAGE_SIZE),
                // 必须显式排序，否则翻页可能出现重复或漏数据
                Wrappers.<Song>lambdaQuery().orderByAsc(Song::getSongId));
    }
}
