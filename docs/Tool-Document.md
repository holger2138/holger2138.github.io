## git 的基本使用

```sh
git config --global user.name "Holger2138"
git config --global user.email "holger2138@foxmail.com"
查看全局 git config --list
```

```sh
-t 类型 -C 文件描述
ssh-keygen -t rsa -C "holger2138@foxmail.com"  创建SSH Keys
```

- git reset 系列

git 有三个区域 repository(HEAD) 暂存区(staged/index) 及工作区(working tree)

```sh
git reset --hard HEAD^ // HEAD index workingtree ===> 全部丢弃
git reset --soft HEAD^ // HEAD index ===> 放入暂存区    workingtree ====> 工作区
git reset HEAD^  // 默认 --mixed HEAD index workingtree ===> 全部放到工作区
```

- 版本回退

```
git reset --hard HEAD^ 回退到上一个版本
git reset --hard HEAD^^  git reset --hard HEAD~2 回退两个版本
git reset --hard <commitId> 回退到指定版本
```

- 撤消修改

```sh
// win下 修改未添加到暂存区 status 红色， 添加到暂存区后 status 绿色
// git checkout dev || git switch dev 切换分支

1.场景1----已添加到暂存区想要删除修改
git restore --staged filename ||git reset HEAD filename 暂存区的文件退还到工作区

2.场景2----未添加到暂存区时想要删除修改
git restore filename || git checkout -- filename 工作区的修改删除
```

- 删除文件

```sh
假如文件夹中有test.txt这个文件
git add test.txt
git commit -m 'add test.txt'
rm test.txt 删除test.txt(此时版本库中该文件还在)
1.场景1----确实要删除
git rm test.txt
git commit -m 'remove test.txt'
2.场景2----删错了，需要找回
git restore test.txt || git checkout -- test.txt
```

- 远程仓库

```sh
# 添加远程仓库
git remote add origin git@gitee.com:holger2138/moba.git
# 修改远程仓库
git remote set-url origin git@gitee.com:holger2138/wangzhe.git

# 推送当前分支到远程
git push origin master:test # git push origin <本地分支名>:<远程分支名>，分支名相同可以简写 git push origin master
# 推送当前分支至远程，并关联远程分支
git push -u origin master

# 删除远程分支
git push -d origin branchName # origin 可省略

# 查看分支关联信息
git branch -vv

# 本地分支与远程分支关联
git branch -u origin/master master # git branch --set-upstream-to=origin/master master
# 本地分支与远程分支关联
git branch --unset-upstream branchName # 如是当前分支（branchName）可省略

# 查看当前远程地址
git remote -v
```

- 分支

  1. 创建与合并分支

     ```sh
     git switch -c dev || git checkout -b dev 创建dev分支 并切换到dev分支
     相当于
     git branch dev 创建dev分支
     git switch dev || git checkout dev 切换到dev分支

     合并分支
     git merge dev // 当前处于master分支 合并dev分支的内容

     git branch 查看当前分支 *表示现现处于某分支
     git branch -d dev 删除分支（合并后的分支删除）
     git branch -D branchName 未合并的分支进行强行删除
     ```

  2. 解决冲突

  3. bug 分支

     ```
     git branch    master dev issue-101
     如果dev 上有未提交的修改的内容，并且你此时并不想提交
     git stash 把内容冻结
     在issue-101上修补bug并提交给(提交的id),最后合并到master分支 后在dev上
     也应用这个bug
     git cherry-pick 提交id
     继续修改以前的内容
     git stash apply stash@{0}，git stash drop
     或者
     git stash pop
     git stash list // 查看冻结的任务
     ```

- 拉取远程分支

  1. 拉取远程分支

     ```
     git fetch origin branchName // 如果远程文件有较新的文件，还需要手动合并， git pull 则是git fetch 和git merge 的组合
     git switch -c branchName origin/branchName
     ```

  2. 删除远程分支

     ```
     git push origin -d branchName
     ```

  3. 关联远程分支

     ```
     git push --set-upstream origin branchName
     git remote rm origin // 删除关联信息
     ```

- git add 的用法

  ```sh
  git add . // 修改的 新增的都会被提交到暂存区，删除的不会被提交
  git add -u // git add --update 仅仅是被修改的
  git add -A // git add --all 上面的两个命令， 修改的 新增的 删除的 都会被提交
  git commit -am // 仅提交已跟踪被修改的
  ```

- git commit --amend

```sh
# scene 1 当提交commit想再次修改commit 信息
git commit --amend --no-edit

# scene 2 当提交commit想再次修改和上次的合并
git add .
git commit --amend --no-edit

# scene 3 当我们想合并所有的提交(包含第一次提交)时可以使用
git rebase -i --root

# scene 4 当我们想合并连续的提交时可以使用
git rebase -i commit<start> commit<end> #  前开后闭 不包含start 会丢弃区间后面的内容
git rebase -i commit^<start> commit<end> # 前闭后闭 start end 都包含 会丢弃区间后面的内容

# scene 5
git rebase branch
```

- `git revert <commit>`

> 生成一个新的 commit 用来撤消 老的 commit 的修改，比 git reset 更加灵活，因为其保存修改记录于 commit 中，可以防止项目丢失历史记录

- `git cherry-pick commitId`

```sh
git cherry-pick commitId # 摘取指定的 commitId
git cherry-pick commitId1 commitId2 # 摘取多个 commitId
git cherry-pick commitId1..commitIdN # 摘取连续的 commitId 不包含 commitId1
git cherry-pick commitId1^..commitIdN # # 摘取连续的 commitId 包含 commitId1
git cherry-pick branch # 摘取最新的 commitId
git cherry-pick ..branch # 摘取所有
```

- git merge dev => fast-forward

<img src="https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20211216115748616.png" alt="image-20211216115748616"  />

- git merge feature1 => conflict

![image-20211216121322521](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20211216121322521.png)

- git log

![image-20211216121724066](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20211216121724066.png)

- 删除 feature1 分支后

![image-20211216122234232](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20211216122234232.png)

- 变基

![image-20211216171020484](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20211216171020484.png)

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
"prettier.singleQuote": true, // 使用单引号
"prettier.trailingComma": "none", // 禁止加逗号
"prettier.useTabs": false, // 不使用tab
```

## Git 使用技巧

::: tip log 自定义

```sh
git log --format="%C(auto) %h %Cred %an %Creset %s %Cblue %ai" -3
```

:::

- 修改提交时间

```sh
# 修改最近一次提交
git commit --amend --date="2022-03-01T09:50:00"

# 修改某次提交
git rebase -i <COMMIT-HASH>^ # 修改交互信息中的 pick 为 e， 保存
# CommitDate AuthorDate  Github是按照 commitDate 来显示的
GIT_COMMITTER_DATE="2022-07-14T19:31:03" git commit --amend --date="2022-07-14T19:31:03" --no-edit
git rebase --continue

git rebase -i --root # 从第一个提交开始
git commit --amend --reset-author --no-edit # 可以重置用户名为全局
```
