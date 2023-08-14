## git 总结

- 配置

```sh
git config --global user.name "HOLER"
git config --global user.email "holger2138@gmail.com"
# 创建SSH Keys -t 类型 -C 文件描述
ssh-keygen -t rsa -C "holger2138@gmail.com"
git config --global --list # 查看全局配置
git config --global http.https://github.com.proxy localhost:10809
git config --global --unset http.https://github.com.proxy
npm config set registry https://registry.npmmirror.com/

```

::: tip
git 有三个区域 版本库 (repositoryHEAD) 、暂存区(staged/index) 、 工作区(working tree)

```sh
# HEAD 可省略
git reset --hard HEAD^ # HEAD index workingtree ===> 全部丢弃
git reset --soft HEAD^ # HEAD index ===> 放入暂存区    workingtree ====> 工作区
git reset HEAD^  # 默认 --mixed HEAD index workingtree ===> 全部放到工作区
```
:::

- 远程仓库

```sh
# 添加远程仓库
git remote add origin repository

# 删除远程仓库
git remote remove origin

# 修改远程仓库
git remote set-url origin repository

# git pull 则是git fetch 和 git merge 的组合
git pull origin branchName

# 创建新分支并关联远程分支
git switch -c branchName origin/branchName

# 推送分支到远程 <本地>:<远程> 分支名相同可以简写 git push origin master
git push origin master:master

# 推送分支至远程，并关联远程分支
git push -u origin master

# 删除远程分支 origin 可省略
git push -d origin branchName

# 本地分支与远程分支关联 git branch --set-upstream-to=origin/master master
git branch -u origin/master master
# 本地分支与远程分支关联 处在当前分支可省略
git branch --unset-upstream branchName

# 查看当前远程地址
git remote -v

# 查看分支关联信息
git branch -vv
```

- git add

```sh
# 修改(modified)  删除(deleted)  未跟踪(untracked)
git add -u # --update  modified deleted
# v2 可使用 (git add --ignore-removal .) 替代
git add . # v1版本 untracked modified  v2版本等同于 git add -A
git add -A # --all modified deleted untracked
git commit -am # 修改与删除 不包含untracked
```

- git commit --amend


```sh
# scene 1 当提交commit想再次修改commit 信息
git commit --amend --no-edit

# scene 2 当提交commit想再次修改和上次的合并
git add .
git commit --amend --no-edit

# 修改最近一次提交 AuthorDate
git commit --amend --date="2022-03-01T09:50:00"

# 修改某次提交 CommitDate AuthorDate  Github是按照 commitDate 来显示的
GIT_COMMITTER_DATE="2022-07-14T19:31:03" git commit --amend --date="2022-07-14T19:31:03" --no-edit

# 可以重置用户名为全局 会改变commitID 此方法会重置日期
git commit --amend --reset-author --no-edit

git filter-branch -f --env-filter 'GIT_AUTHOR_NAME=HOLGER GIT_AUTHOR_EMAIL=holger2138@gmail.com GIT_COMMITTER_NAME=HOLGER GIT_COMMITTER_EMAIL=holger2138@gmail.com'

```

- git revert

> 生成一个新的 commit 用来撤消 老的 commit 的修改，比 git reset 更加灵活，因为其保存修改记录于 commit 中，可以防止项目丢失历史记录

- git log 自定义

```sh
git log --format="%Cred%h  %CresetCD:%Cgreen%cI  %CresetAD:%Cgreen%aI  %Cblue%an  %Cgreen%s  %Cred%D"
```


- git rebase

- 压缩提交

  ```sh
  git rebase -i [startpoint] [endpoit] # 压缩中间的合并 前开后闭
  git rebase -i [startpoint]^ [endpoit] # 压缩中间的合并 前闭后闭
  git rebase -i --root # 从第一个提交开始
  # 建议使用（endpoint 省略时默认为HEAD,否则的话区间后面的内容会在合并的时候忽略掉）
  git rebase -i [startpoint] 
  ```

  - 分支合并

  ::: details 通过 shell 脚本生成提交纪录
  <!-- <<< @/snippets/rebase.sh -->

  ```sh
  # 可能需要代理 -x
  curl -s https://raw.githubusercontent.com/holger2138/holger2138.github.io/main/docs/snippets/rebase.sh | sh
  ```

  :::

  master a b c d f h

  dev a b c d e g 所有的提交按 a-h 顺序提交

  ```sh
  git rebase master
  # 合并 dev 分支 git rebase dev | git merge dev;
  git switch master
  git merge dev
  ```

  merge 的提交总是按照时间为顺序 a b c d e f g 'fix conflicts' 并会产生一次新的提交。

  dev 分支把自己的异（e g）拷贝一份副本, 基变为 master ，再拼接，最后的提交顺序 a b c d f h e g

  ![image-20221202132537565](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20221202132537565.png)

  ::: details 总结
  对比 merge，

  merge 优点: 可以追溯纪录 所有的 hash 值不会改变,但是有冲突时会多一条提交纪录

  rebase 优点: 合并后 commit 问题在最前面，commit history 保持一条直线，但 hash 值也会随之更改
  :::

::: danger rebase 实用小技巧

master 远程分支和本地分支都分别有更新时可以通过三种方法实现推送最新代码

- 1：在 master 分支 `git pull --rebase`来把自己本地的异拷贝一份副本（commmitId 不同），基变成远程仓库的 HEAD，然后解决冲突，就完成拼接了
- 2：在 dev 分支 `git pull --rebase origin master` => `git switch master` => `git merge dev` => `git push`
- 3：在 dev 分支 `git pull --rebase origin master` => `git push origin dev:master`

自己的本地提交总在最前，commitID 也会随之变化

:::

- git cherry-pick

```sh
git cherry-pick commitId # 摘取指定的 commitId
git cherry-pick commitId1 commitId2 # 摘取多个 commitId
git cherry-pick commitId1..commitIdN # 摘取连续的 commitId 不包含 commitId1
git cherry-pick commitId1^..commitIdN # # 摘取连续的 commitId 包含 commitId1
git cherry-pick branch # 摘取最新的 commitId
git cherry-pick ..branch # 摘取所有
```


## 腾讯云服务器使用总结

ubuntu 初始用户默认账号是 ubuntu ，root 账号需要自己设置

sudo passwd root 输入两次密码

sudo vi /etc/ssh/sshd_config

进入 ssh 配置界面后找到 PermitRootLogin，将它后面改为 yes，保存 (按 i 进入编辑模式，编辑完 esc 退出，:w 保存当前文件，:q 退出)---前面#号也要去掉

```sh
sudo service ssh restart

apt show nginx

apt intall nginx -y

apt install mongodb-server -y

apt install git -y

ssh-keygen

cat /root/.ssh/id_rsa.pub  公钥复制下来 添加到部署服务器

apt install nodejs -y 升级下版本

apt install npm -y

npm config set registry https://registry.npm.taobao.org

npm i nrm -g

npm list -g --depth 0

npm i n -g 升级node 本身

n lts 升级node 退出后即可查看最新版本
git clone 到任意文件夹
npm i -g pm2 相当于nodemon 服务端用的
pm2 start

nginxconfigio
nginx -t 校验配置文件是否正确
service nginx reload 重新启动nginx
```

```sh
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo sed -i 's/security.ubuntu/mirrors.aliyun/g' /etc/apt/sources.list
sudo sed -i 's/archive.ubuntu/mirrors.aliyun/g' /etc/apt/sources.list
sudo apt update
sudo apt-get upgrade

sudo apt-get install package 安装包
sudo apt-get remove package 删除包
sudo apt-cache search package 搜索软件包
sudo apt-cache show package  获取包的相关信息，如说明、大小、版本等
sudo apt-get install package --reinstall  重新安装包
sudo apt-get -f install  修复安装
sudo apt-get remove package --purge 删除包，包括配置文件等
sudo apt-get build-dep package 安装相关的编译环境
sudo apt-get upgrade 更新已安装的包
sudo apt-get dist-upgrade 升级系统
sudo apt-cache depends package 了解使用该包依赖那些包
sudo apt-cache rdepends package 查看该包被哪些包依赖
sudo apt-get source package  下载该包的源代码
sudo apt-get clean && sudo apt-get autoclean 清理无用的包
sudo apt-get check 检查是否有损坏的依赖
```

## Nginx

```js
rewrite  ^(.*)$  /chrome/$1
http://localhost:3000/test.xxx.html
http://localhost:3000/chrome/test.xxx.html
```

## MongoDB shell

```sh
mongodump -d dbname
mongorestore
mongo
show dbs     // 显示所有数据库
db              // 显示当前所在数据库
use dbName  //  切换到dbName数据库
show collections // 显示当前数据库的集合（Model)
db.dropDatabase() // 删除当前数据库
db.collectionName.drop()  // 删除当前数据库的某个集合
db.createCollection('Categories') // 创建Categories集合  一般不用
```

## MySQL

```sh
// 以管理员方式启动 mysql 8 以上版本不需要 my.ini 文件
mysqld --initialize --console
mysqld -install
// 启动服务
net satart mysql
// 登录
mysql -h localhost -P 3306 -u root -p
mysql -h localhost -P 3306 -u root -pqwerty2138 // 密码不能有间隔
mysql -u root -pqwerty2138 //简写
// 修改密码
ALTER USER USER() IDENTIFIED BY '123456';
// 停止服务
net stop mysql

// 查看版本
mysql --version // shell 命令
select version() // 登录后查看

// 基本操作
show databases;
create database databaseName // 创建数据库
select database() // 查看当前所在库
use databaseName // 使用某个数据库
show tables; 查看数据库表
show tables from mysql; 查看mysql数据库中的表
create table tableName(id int,name varchar(20)); // 创建表
desc tableName // 查看表结构
select * from tableName // 查看表数据
insert into tableName (id,name) values(1,'HJ') // 插入数据
update tableName set name='HOUJIAN' where id=1; // 修改数据
delete from tableName where id=1; // 删除数据
```

- 查询语句

```sh
/* 1. 查询单个字段 */
SELECT last_name FROM employees;
/* 2. 查询多个字段 */
SELECT last_name, salary AS 工资, email AS 电子邮箱 FROM employees;
/* 3. 查询所有字段 */
SELECT * FROM employees;
SELECT version();
/* 4. 别名 */
SELECT 100 % 98 AS result;
SELECT 100 % 98 result;
SELECT 100 % 98 AS "out put";
/* 5. 去重 */
SELECT DISTINCT department_id FROM employees;
/* 6. + 号的作用 */
SELECT CONCAT( first_name, last_name ) AS 姓名 FROM employees;
SELECT CONCAT(first_name, last_name, '：', IFNULL( commission_pct, 0 )) FROM employees;
/* 是否为空 */
SELECT ISNULL( commission_pct ) AS 绩效, commission_pct FROM employees;
```

- 条件查询

```sh
/*
1. 条件表达式  > < = >= <= !=  <> 不等于
2. 逻辑运算符 && || ! and or not
3. 模糊查询
like
1. % 任意多个字符 不区分大小写 包含多个字符
2. _ 任意单个字符
between and
1. 包含临界值
2. 两个临界值不能颠倒顺序
in
1. 不支持 % _
is null | is not null
1. 不支持使用 = null || <> 判断 null
2. 可以使用安全等于 <=>
*/
SELECT * FROM employees WHERE salary > 12000;
SELECT * FROM employees WHERE employee_id >= 150 && employee_id <= 160;
SELECT * FROM employees WHERE last_name LIKE "a%";

SELECT * FROM employees WHERE last_name LIKE '_\_%';
SELECT * FROM employees WHERE last_name LIKE '_$_%' ESCAPE '$';
SELECT * FROM employees WHERE employee_id BETWEEN 100 AND 160;

SELECT * FROM employees WHERE job_id  = 'AD_PRES' OR job_id= 'IT_PROG';
SELECT * FROM employees WHERE job_id IN ('AD_PRES' ,'IT_PROG');

SELECT * FROM employees WHERE commission_pct IS NULL;
SELECT * FROM employees WHERE commission_pct <=> NULL;
SELECT * FROM employees WHERE salary <=> 12000;
SELECT * FROM employees WHERE salary = 12000;

SELECT * FROM employees WHERE commission_pct IS NOT NULL;

SELECT last_name, department_id, salary * 12 * IFNULL( 1+commission_pct, 0 ) AS 年薪 FROM employees WHERE employee_id = 176;

SELECT salary, last_name FROM employees WHERE commission_pct IS NULL AND salary<=12000;
```

- 排序

```sh
/* 排序查询  不写默认升序 也可用别名 */
SELECT * FROM employees WHERE department_id >= 90 ORDER BY hiredate;
SELECT *, salary * 12 * ( 1 + IFNULL( commission_pct, 0 )) AS 年薪 FROM employees ORDER BY 年薪;
SELECT * from employees ORDER BY LENGTH(last_name);

SELECT * FROM employees ORDER BY salary DESC, employee_id;

SELECT last_name, department_id, salary * 12 * (1 + IFNULL(commission_pct,0)) AS 年薪 FROM employees ORDER BY 年薪 DESC, last_name ASC;

SELECT last_name, salary FROM employees WHERE salary NOT BETWEEN 8000 AND 17000 ORDER BY salary DESC;

SELECT *, LENGTH(email) AS 长度 FROM employees WHERE email LIKE '%m%' ORDER BY LENGTH(email) DESC, department_id ASC;
```

- 函数

1. 字符函数

```sh
/* 常见函数 */

/* 字符函数 */
SELECT LENGTH('hello');
SELECT LENGTH("侯健");
/* gbk 2个字节 utf8 3 个字节*/
SHOW VARIABLES LIKE '%character%'

SELECT CONCAT(last_name,'-',first_name) as 姓名 FROM employees
SELECT UPPER('hello')
SELECT LOWER("HELLO")

/* 索引从1 开始*/
SELECT SUBSTR("我是你大爷",4)
/* 截取位置，截取长度*/
SELECT SUBSTR("我是你大爷",3,3)
/* 返回子字符串第一次出现的索引，如没有则返回0 false*/
SELECT INSTR("我是你大爷的大爷","大爷")

SELECT TRIM('    我是你大爷    ')
/* 返回我是你aaaa大爷 */
SELECT TRIM('a' FROM "aaaaaaaaa我是你aaaa大爷aaaaaaa")

/* aaa你好 */
SELECT LPAD('你好',5,'a')
/* 你好啊，我 */
SELECT LPAD('你好啊，我是你大爷',5,'a')
SELECT RPAD('你好啊',5,'a')
/* 张无忌爱上了赵敏 */
SELECT REPLACE('张无忌爱上了周芷若','周芷若','赵敏')
/* 赵敏赵敏赵敏张无忌爱上了赵敏 */
SELECT REPLACE('周芷若周芷若周芷若张无忌爱上了周芷若','周芷若','赵敏')
```

## Sequelize 操作 MySQL

- 关联相关

![image-20201205224525016](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20201205224525016.png)

```js
// 根据 teamId 中的 teamCode 查询 players
Team.hasMany(Player, {
  // Player 表中的 teamCode, 会自动生成
  foreignKey: 'teamCode',
  // Team 表中的 teamCode(需要手动创建) =》 默认情况下是主键(可省略)
  sourceKey: 'teamCode'
});

// 根据 playerId 中的 teamCode 查询 Team
Player.belongsTo(Team, {
  // Player 表中的 teamCode, 会自动生成
  foreignKey: 'teamCode',
  // Team 表中的 teamCode(需要手动创建) =》 默认情况下是主键(可省略)
  targetKey: 'teamCode',
  /**
   * 别名 => 当我们需要通过playerId 联表查询 Team 时
   * 需要在两个位置都指定
   *  首先是如下所示 还有如上图所示 效果如下所示
   * */
  as: 'teamInfo'
});

/**
 *  说明 上述操作 Team 是主表 Player 是从表
 *  外键想在于从表当中(teamCode)
 *    外键会自动插入不用手动创建
 *  默认是主表中主键的id关联外键
 *  如果新增 Player row,teamCode必须有值且必须是主表中存有的值
 */
```

![image-20201205224718685](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20201205224718685.png)

- sequelize-cli

```sh
npm init -y
npm i sequelize-cli -D
npm i sequelize mysql2 -S
// 创建数据库
npx sequelize db:create
// 创建表 migrations文件迁移文件
npx sequelize model:generate -name User --attributes firstName:string,lastName:string
// 如数据库中无sequelizemata表则创建 根据migrations文件夹中的文件创建 创建users表
npx sequelize db:migrate
npx sequelize db:seed:all
```

- 通过 chrome 控制台抓取数据

```js
$$('.hero-nav > li').map((item, i) => {
  return {
    name: item.innerText,
    heros: $$('li', $$('.hero-list')[i]).map(hero => {
      return {
        name: $$('h3', hero)[0].innerHTML,
        avtar: $$('img', hero)[0].src
      };
    })
  };
});

$$('#jSearchHeroDiv li').map(item => {
  return {
    nickName: item.innerText,
    name: $$('img', item)[0].alt.split(' ')[1],
    avatar: $$('img', item)[0].src
  };
});
```

```sh
`yarn upgrade-interactive --latest` //更新本地开发依赖

`nestjs-typegoose mongoose @typegoose/typegoose`

语法提示包：`@types/mongoose`
```

## VS Code 实用小技巧

- Eslint

`semi: ['error', 'never']` 不允许使用分号

` quotes: ['error', 'single']` 不允许用不用又引号

`space-before-function-paren': ['error', 'never']`

- vs code prettier 配置

```json
"prettier.useEditorConfig": false, // 不使用.editorConfig文件
"prettier.semi": false, //
"prettier.singleQuote": true, // 使用单引
"prettier.trailingComma": "none", // 禁止加逗号
"prettier.useTabs": false, // 不使用tab
```
