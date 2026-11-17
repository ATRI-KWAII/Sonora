package org.example.myjava.dto;

import lombok.Data;

/**
 * 歌曲查询参数。
 * <p>字段用 private + 小驼峰命名，@Data 生成 getSongId/setSongId 供 Spring 绑定参数。
 * <p>注意：当前获取单曲已改为路径变量（GET /api/songs/{songId}），这个 DTO 先保留，
 * 后续做列表、搜索、分页等查询参数时再扩展。
 */
@Data
public class SongDTO {
    private Long songId;
}
