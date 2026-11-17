package org.example.myjava.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.example.myjava.common.BusinessException;
import org.example.myjava.dto.UserLoginDTO;
import org.example.myjava.entity.User;
import org.example.myjava.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public void register(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        // status 是基本类型 long，默认 0 会被 MP 当成非空字段一起插入，覆盖库里的 DEFAULT 1，
        // 新用户就变成“已删除”状态，所以这里必须显式置 1。
        user.setStatus(1);
        userMapper.insert(user);
    }

    public User login(UserLoginDTO userLoginDTO) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", userLoginDTO.getEmail()).eq("password", userLoginDTO.getPassword());
        User user = userMapper.selectOne(queryWrapper);
        if (user == null) throw new BusinessException("NO");
        return user;
    }
}
