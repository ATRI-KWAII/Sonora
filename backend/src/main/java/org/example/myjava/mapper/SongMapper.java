package org.example.myjava.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.example.myjava.entity.Song;
@Mapper
public interface SongMapper extends BaseMapper<Song> {
}
