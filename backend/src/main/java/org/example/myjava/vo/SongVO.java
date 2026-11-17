package org.example.myjava.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.myjava.entity.Song;

/**
 * 歌曲视图对象（返回给前端的数据结构）。
 * <p>字段统一小驼峰；注意 {@code songUrl} 的拼写（原为 songURl，序列化后会给前端一个畸形字段名）。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongVO {
    private String songUrl;
    private String songName;
    private String coverUrl;
    private long time;
    private String singer;

    public SongVO(Song song) {
        this.songName = song.getSongName();
        this.songUrl = song.getSongUrl();
        this.coverUrl = song.getCoverUrl();
        this.time = song.getTime();
        this.singer = song.getSinger();
    }
}
