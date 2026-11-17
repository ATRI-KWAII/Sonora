package org.example.myjava.vo;

import lombok.Data;

import java.util.Map;

@Data
//返回一页"歌曲列表"
public class SongListVO {
    //列表中有几首歌曲?(不可超过十个)
    private Long size;
    //歌曲列表
    private Map<String,String> songList;
}
