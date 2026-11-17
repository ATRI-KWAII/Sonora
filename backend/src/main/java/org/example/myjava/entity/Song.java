package org.example.myjava.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 歌曲资源实体，对应 song 表（MyBatis-Plus）。
 * <p>列名统一显式声明为 snake_case，不依赖"驼峰自动转下划线"的默认推导，
 * 避免默认规则变化后查到不存在的列。
 */
@Data
@TableName("song")
public class Song {

    /** 歌曲id：数据库自增主键（BIGINT AUTO_INCREMENT） */
    @TableId(value = "song_id", type = IdType.AUTO)
    private long songId;

    /** 歌曲地址：存相对路径或对象存储 key，不要存死域名 */
    @TableField("song_url")
    private String songUrl;

    /** 歌名 */
    @TableField("song_name")
    private String songName;

    /** 歌手 */
    @TableField("singer")
    private String singer;

    /** 歌曲时长。单位要先定好（建议秒），后续建议改名为 duration，避免和 MySQL 的 TIME 类型混淆 */
    @TableField("time")
    private long time;

    /** 歌曲图标（封面）地址 */
    @TableField("cover_url")
    private String coverUrl;
}
