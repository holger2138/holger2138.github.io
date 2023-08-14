### 关于`$`的理解

> 对于`Shell`的一点理解
>
> $会引用变量的值

### `echo`的使用

-n 取消换行 -e 开启引号（单引 双引）中的反斜杠转义（ backslash escapes ） -E 禁止反斜杠转义

如果命令较长 可以用加上反斜杠写成多行 echo hello \world

```sh
$ 不会在单引号中进行转义
\ 不会在单引号中进行转义 在没有引号的情况 奇数会进行换行转义 偶数直接转义
  在有双引号的情况下会转义可能会转义反斜杠（反斜杠后面紧跟着双引号的时候）
* 在不加引号的情况下可以进行文件扩展

```

## **命令转换（`command subsititution`）**

<code>\`...\`</code>(`backticks `| `back quotes`) 和 ` $(...)` 都是命令置换====> 把命令的执行结果返回。

<code>\`...\`</code>在使用时尤其要注意思 **美元符号 反斜杠 反引号** 的使用，建议优先使用 `$(...)` [参考链接](https://mywiki.wooledge.org/BashFAQ/082)

```sh
# `...` 里如果有转义符（反斜杠 backslashes）时可能会被以不明显的方式处理掉，$(...) 不会
echo "`echo \\a`" "$(echo \\a)" # a \a
echo "`echo \\\\a`" "$(echo \\\\a)" #  \a \\a
# 下面的例子，使用的 *single quotes* 也是一样的
foo=`echo '\\'`;bar=$(echo '\\')
echo "foo is $foo, bar is $bar" # foo is \, bar is \\

# 不明显的方式表现为 有多对的反斜杠时会向上取整 （Math.ceil(n/2)）
foo="`echo '\aa'`"; bar="$(echo '\\aa')" # \aa \\aa
foo="`echo '\\\\aa'`";bar="$(echo '\\aa')" # \\a \\aa
foo="`echo \"\\\\aa\"`";bar="$(echo "\\aa")" # \aa  \aa
foo="`echo '\\\\\aa'`"; bar="$(echo '\\\\\aaaa')" # \\\aa \\\\\aaaa

# # $(...) 中的引号是一对的，而不是 x 前面的引号 与 $y 前面的引号是一对
# echo "x is $(sed ... <<< "$y")"
# echo "x is `sed ... <<< \"$y\"`"

# # 对于嵌套的话， $(...)更好用
# x=$(grep -F "$(dirname "$path")" file)
# x=`grep -F "\`dirname \"$path\"\`" file`

$(cat file) 等同于 $(< file)

```

### **`eval`的使用**

```sh
# eval 可以用来回显简单变量
foo=bar
echo $foo
eval echo $foo

# eval 执行字符串命令
bar="ls -AFl"
echo $bar
eval $bar

# eval 可以显示出传递给脚本的最后一个参数
echo "传进来$#个参数"
echo "当前进程ID为$$"
echo '---------------'
echo \$$# # $3字符串
eval echo \$$# # 字符串 asdlfasd
# echo eval echo \$$# # eval echo $1
echo "当前最后一个参数是$(eval echo \$$#)" # 不明白 $(字符串) 为什么还是字符串

echo '---------------'
# 实现文件的第一列成为变量名 第二列成为变量值
while read NAME VALUE
do
eval "${NAME}=${VALUE}"
done <a.txt
echo "$COMMANY $LANGUE $LIKE"
```

### **算术表达式**

```sh
# ((...)) 语法可以进行整数的算术运算，如果读取运算结果需要在前加上$ ,使其成为算术表达式，返回算术运算的值
# 支持 + - * / % **(指数) ++ --  需要注意的是 除法运算的返回结果总是整数
echo $((3+3))
echo $? #  算术结果不为0，都算成功

((foo= 5 +  5))
echo $foo

((5 - 5))
echo $? # 失败  环境变量 $? 为1

echo $(((5**2)*10)) # 支持嵌套
echo $(( $((5**2)) * 10)) # 与上面是相同的

# echo $((2.5 + 3)) # 只能进行整数运算

num=3
echo $((num + 1)) # echo $(($num + 1)) 变量名加上$ 也是可行的

echo $(("foo" + 1))
echo $(("test" + 1)) # 字符串(双引号)会认为是变量名，如不存在，会将其作为空值，$((...)) 会将空值当作0，因此不会报错
# echo $((‘test’ + 1)) #  单引号报错 ‘test’ + 1: syntax error: operand expected (error token is "‘test’ + 1")

foo=hello
hello=3
echo $((foo + 3)) # 变量foo的值是hello，而hello也会被看作变量名，因此可以写出动态替换的代码

echo $[3+30] # $[...]是以前的写法，不建议使用
```

### 疑惑

```sh
#!/bin/sh

str="hello world"
# 读取变量的语法 $str 可以看是 ${str} 的简写形式
echo $str
echo ${str}

a="hello";
b=a;
echo ${!b} # 输出结果为 hello
echo ${a}_file # 输出结果为 hello_file
```

### 变量

1. **特殊变量**

```sh
$? # 上一条命令的执行结果 0 表示成功 !0 表示失败
$_ # 上一个命令(可能是多条命令的组合)的最后个参数 是最后一个参数 !$是指上一行命令的最后一个参数 !* 上一行命令的所有参数

mkdir a && cd $_ # $_ 代表 a
echo aaa bbb ccc

$$ # 当前 shell的进程ID(PID)  可通过 ps 命令查看
$! # 后台异步命令的进程ID

$0 # 当前 shell 脚本的名称

$- # 当前脚本的启动参数
$# # 脚本的参数数量
$@ # 脚本的参数值

foo='hello world' # varname 必须为变量名
${#varname}
echo ${#foo} # 返回length 11
${varname:offset:lenth} # offset 为负数时必须要有空格 与模式匹配区分
echo ${#foo} # 11
echo ${foo:6} # world
echo ${foo:6:3} # wor
echo ${foo: -5:3} # wor
echo ${foo: -5} # world
echo ${foo: -5:-1} # worl
echo ${foo:6:-3} #wo

# 大小写转换
a=abcdefg
b=${a^^}
c=${b,,}
echo $a
echo $b; # 大写
echo $c; # 小写



```

2. **默认值**

```sh
echo ${foo:-bar} # 如果foo存在，则返回它的值，反之则返回bar
echo $foo

echo ${bar:=baz} # 如果bar存在，则返回它的值，反之将bar的值设为baz并返回
echo $bar

echo ${baz:+qux} # 如果baz存在，则返回qux，反之返回空
echo $baz

echo ${qux:?不存在} # 如果qux 存在，则返回它的值，否则打印出 qux: 不存在 并中断脚本的执行
echo ${1:?参数不存在} # 当我们执行脚本不传参数时会报错，并且后续代码不会在执行

foo=USERNAME
echo ${!foo} # 展开值最终为 $USERNAME 的值

echo ${!S*} # 扩展为以S前缀开关的变量名称，可以循环 等同于 echo ${!S@}

```

3. **搜索与替换**

```sh
# 头部模式匹配 ${varname#pattern} 非贪婪匹配 ${varname##pattern} 贪婪匹配
# 头部匹配 不会改变原变量  匹配模式支持 * ? [] 等通配符 匹配失败返回原字符串
bar='abcabcdefgabcdefg'
echo ${bar#abc} #abcefgabcefg
echo ${bar##abc} #abcdefgabcdefg
echo ${bar#*defg} #abcdefg
echo ${bar#sdsdas} # 匹配失败，返回原字符串 abcabcdefgabcdefg
echo ${bar##*defg} # 空
echo $bar # 不会改变原变量

path=/users/holger/downloads/long.file.name
echo ${path#/*/} # holger/downloads/long.file.name 非贪婪匹配
echo ${path##/*/} #long.file.name 贪婪匹配
echo ${path#*/} # holger/downloads/long.file.name
echo ${path##*/} # logn.file.name 直接取文件名

echo ${bar/#abc/123} #123abcdefgabcdefg
echo ${bar/##abc/456}

echo '================='
# 尾部模式匹配 ${varname%pattern} 非贪婪匹配 ${varname%%pattern} 贪婪匹配

echo ${path%.*}  # /users/holger/downloads/long.file
echo ${path%%.*} # /users/holger/downloads/long
echo ${path%/*} # /users/holger/downloads 返回目录
file=avatar.png
echo ${file%.*}.jpg # 改文件后缀名（suffix）

echo ${file/%png/jpg} # 尾部替换

#任意位置模式匹配 ${varname/pattern} 非贪婪匹配 ${varname//pattern} 贪婪匹配
path=/home/foo/foo/foo.name
echo ${path/foo/bar} # /home/bar/foo/foo.name
echo ${path//foo/bar} # /home/bar/bar/bar.name
echo ${path/.*/} # /home/foo/foo/foo 删除后缀
echo '============='
echo -e ${PATH//:/'\n'} # 让 PATH 变量进行换行，提高可读性
```

### 扩展模式

```sh
 touch a.txt b.txt ab.txt 'a b'.txt

# ? 匹配单个字符 如果匹配不到，则原样输出
echo ?.txt # a.txt b.txt ?(不要与正则语法 题词语法（extglob）混为一谈)
echo ??.txt # ab.txt
echo ???.txt # a b.txt 网道教程说不匹配空格 其实是可以匹配的

echo *.txt # a b.txt a.txt ab.txt b.txt *(匹配任意数量的字符，包含0 区间{0,n} )  不会匹配子目录
echo .* # . .. .gitignore 三个文件
echo .[!.]* # .gitignore 等同于 .[!.]*
echo */*.txt # dir/a.txt 只匹配一层子目录
echo **/*.txt # 可以匹配顶层与任意深度的文件 globstar(默认打开状态)，如未打开，执行shopt -s globstar

echo [ab].txt # a.txt b.txt 不包括 ab.txt
ls [ab].txt # 如果 a b 已删除，会直接 ls [ab].txt 找不到，则会报错  ls: cannot access '[ab].txt': No such file or directory

ls [!a].txt # b.txt 等同于 [^a].txt 如果找不到，则找单个字符的，还找不到时的话，则 ls [!a.txt]
rm -rf * .[!.]* # 可以删除当前目录所有文件
ls [a-c].txt # 可以匹配 a.txt b.txt c.txt 如果要包含 - 的文件 则需要放在中括号开关或者结尾 [-aeiou] [aeiou-] 匹配 [ 文件 [[aeiou]

echo {1,2,3} # 1 2 3
echo d{a,e,i,o,u}g # dag deg dig dog dug   中间不能有空格 echo d{a,e,i,o, u}g d{a,e,i,o, u}g
echo a.log{,.bak} # a.log a.log.bak 逗号前面可以没有值，表示为空
echo {j{p,pe}g,png} # jpg jpeg png 大括号可以嵌套
echo /bin/{cat,b*} # /bin/cat /bin/b2sum.exe /bin/backup... 大括号可以与其他模式联用，优先于其他模式 等同于 echo /bin/cat;echo /bin/b*

echo {a..e} # a b c d e
echo {d..a} # d c b a

# touch [a..d].txt 与 touch {a..d}.txt的区别，[] 创建了[a-z].txt文件，{a..d} 创建了a b c d 四个文件
# echo 也是相同情况 {} 大括号不是文件名扩展，而是扩展值

```

- `shopt`

```sh
shopt -s optname # 打开某个参数 set
shopt -u optname # 关闭某个参数 unset
shopt optname # 查询当前参数开关状态
shopt # 查看所有 optname 状态

正常情况下 ls * 是不会显示隐藏文件 当 dotglob 打开后 可以显示 .开关的隐藏文件

假设没有以b开关的文件（名|夹），正常情况下 rm b* ，会报错 rm: cannot remove 'b*': No such file or directory
当打开 failglob 后，报错 bash: no match: b* 因为 b* 不匹配任何文件，bash 直接报错，rm 命令不再执行
当打开 nullglob 后，报错 rm: missing operand 因为 b* 扩展成了空字符串 ，rm 缺少参数

当打开 nocaseglob 后， ls B*;如果有小写b开头的文件，也可以显示出来

文件结构 a.txt ab.txt abc.txt abcbc.txt    extglob(默认打开)
echo a?(bc).txt # 匹配{0，1}次 a.txt abc.txt
echo a*(bc).txt # 匹配{0，n}次 a.txt abc.txt abcbc.txt
echo a+(bc).txt # 匹配{1,n}次 abc.txt abcbc.txt
echo a@(bc).txt # 匹配1次 abc.txt
echo a!(bc).txt # 除了bc a.txt ab.txt abcbc.txt

文件结构 a.txt  sub1/b.txt   sub1/sub2/c.txt
ls *.txt */*.txt */*/*.txt # 未打开 globstar 时，查找全部以txt结尾的文件
ls **/*.txt # 打开后 a.txt  sub1/b.txt  sub1/sub2/c.txt

```

## Shell 输入输出重定向

#### 重定向

```sh
# 文件描述符 stdin(0) stdout(1) stderr(2)

echo "hello world" 1> a.txt # 标准输出重定向到时a.txt 1表示输出后面不能有空格
echo "hello world" > a.txt # 1 可省略
echo "hello world" >> a.txt # >> 表示追加

(echo "hello world" && llll) 2> /dev/null # 将标准错误重定向到 /dev/null(黑洞)
lsss 2>> a.txt # 标准错误重定向到 a.txt
(echo "hello world" && lsss) 1>> a.txt 2>> a.txt # 标准输出 标准错误 都重定向到 a.txt
(echo "hello world" && lsss) 1>> a.txt 2>&1 #简写语法 （2>&1）是追加的意思
(echo "hello world" && lsss) &>> a.txt # 进一步简写 如果写成 （&> a.txt）没有追加
(echo "hello world" && lsss) 2>&1 >/dev/null # 把标准错误输出到终端， 标准输出重定向到 /dev/null

# 输入重定向
cat < a.txt > b.txt # 将 a 文本内容输入到b中 等同于 cat a.txt > b.txt
cat < a.txt >> b.txt # 将 a 文本内容追加到 b 文本中
# 对于中文乱码的情况
ipconfig //displaydns | iconv -f GB2312 -t UTF-8 > dnsCache.txt
```

#### here document

```sh
foo=USERNAME

# 默认会发生转义
cat << EOF
AAA
$foo
'$foo'
"$foo"
EOF

# 如不想转义可以把 here 文档的开始标记放入引号（单双都可以）中
cat << 'EOF'
AAA
$foo
'$foo'
"$foo"
EOF

# 如果想对齐文档格式 需要把缩进（indent）调为制表符 << 后面加上 -
cat <<- 'EOF'
	AAA
	$foo
	'$foo'
	"$foo"
EOF

# hero document 本质是重定向，相当于 echo 命令的重定向。所以 here doc 对于 echo 命令无效。上面的相当于 echo string | command

# 4 将会定稿 here.txt
wc -l << EOF >here.txt
aaa
bbb
ccc
EOF

# 将输入文本写入文件
cat << EOF >a.txt
aaa
bbb
EOF
```

#### here string

```sh
# here string 是 here document 的变体，
cat <<< 'hello world'  # 控制台输出传给 cat，等同于  echo hello world | cat

# a 文件写入 hello world
echo hello world | cat > a.txt
echo -e "hello\nworld" | cat | wc -l # 终端输出2

# < 改变读取（stdin） > 改变输出(stdout)
```

## 常用命令

- rm

```sh
# -r 递归 -f 强制 --force
```

- ls

```sh
# a 显示所有文件（包含隐藏文件 .开头的） A 显示所有文件（除了 . .. ）
# F显示文件类型（文件夹显示/ 链接文件显示@ 可执行文件显示*） R 显示文件（若子目录有文件也依次显示）
# l 显示长信息 h 显示可读性的文件大小 i ==> inode
```

-  function Vue(options) {  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {    warn('Vue is a constructor and should be called with the `new` keyword');  }  this._init(options);}// 实例方法 __initinitMixin(Vue);// 实例方法 $data $props $set $delete $watchstateMixin(Vue);// 实例方法 $on $once $off $emiteventsMixin(Vue);// 实例方法  _update（没写错）lifecycleMixin(Vue);// 实例方法 $nextTick _render _o _n _s _l _t _q _i _m _f _k _b _v _e _urenderMixin(Vue);​export default Vue;js

```sh
# -z gzip -c 创建 -x 解压 -v verbose显示处理过程 -f 备份文件 -t 显示归档文件的内容（不会解压缩）
# --remove-files 压缩文件的同时删除源文件(复数说明不能用于 删除归档) -C 解压后放入指定目录
# 第一位置永远放 tar.gz 文件，不管是归档还是压缩
```

- ln

> warn: windows 下 软链接（`symbolic links`）可能会失效，变成复制（`inode` 不同） [参考](https://github.com/orgs/community/discussions/23591)
>
> 硬链接（`hard links`）表现正常 ，硬链接与复制不同

```sh
# ln -s targe linkName 创建软链接(符号链接 文件 || 目录) 对于文件目录来说 rm linkName 不要加上/ 否则会删除target 文件
# ln target linkName 创建硬链接（只能是文件）

# 软链接（文件） rm aFileSoftLink 不影响 target
ln -s test/a/a.txt  ./aFileSoftLink
# 软链接（目录） rm aDirSoftLink ===> 无影响 （与win 右键删除一样）
# rm aDirSoftLink/ 若目录后加上斜杠，当前软链接目录还在文件则被删除（影响 target）
ln -s ./test/a aDirSoftLink

# 硬链接 只能创建文件
# 删除硬链接 || target  都不会有影响（有点类似指针的概念）
# 可通过 ls test/a/a.txt aFileHardLink -il 查看 inode 是相同的
ln test/a/a.txt aFileHardLink
```

## vim

- 插入模式

i 当前光标位置插入 I 当前行行首插入

a 当前光标下一个位置插入 A 当前行行尾插入

o 当前行的上一行插入 O 当前行的下一行插入

s 删除当前光标下一个位置的内容，并插入 S 清除当前行内容并在行首插入

## Curl 下载

::: tip [Usage](https://daichangya.github.io/everything-curl/#/book/curl.zh):

- -L 请求重定向
- -x --proxy 使用代理
- -O --remote-name URL 最后一部分当作文件名
- -J --remote-header-name 服务器可能会提供一个名为 Content-Disposition 作为响应，这个响应包含传输内容的文件名建议，优先及比 -O 要高
- -o --output 可以是文件名及路径拼接文件名 -o- | -o - 可能强制二进制文件输出到终端, stdout > 可以重定向
- -C --continue-at 下载续传。 不能与 -J 属性组合
- --create-dirs 用于创建下载目录
- --output-dir 下载目录，如果目录不存在，不会自动创建 可以使用 --create-dirs

:::

```sh
curl -LOx http://localhost:10809 https://github.com/2dust/v2rayN/releases/download/5.38/v2rayN-Core.zip
curl -LOx http://localhost:10809 https://github.com/2dust/v2rayN/releases/download/5.38/v2rayN-Core.zip -C -
curl -Lx http://localhost:10809 https://github.com/2dust/v2rayN/releases/download/5.38/v2rayN-Core.zip >./v2rayN-Core.zip
curl -Ox http://localhost:10809 https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u
```

- 执行脚本

  [官方文档](https://www.gnu.org/software/bash/manual/bash.html#Invoking-Bash)
  [参考链接](https://stackoverflow.com/questions/4642915/passing-parameters-to-bash-when-executing-a-script-fetched-by-curl/4642975)

```sh
curl -sx http://localshot:10809 https://raw.githubusercontent.com/holger2138/holger2138.github.io/main/docs/test.sh | sh # 执行远程脚本
# <( 不能有空格 有参数时
sh <(curl -sx $proxy https://raw.githubusercontent.com/holger2138/holger2138.github.io/main/docs/test.sh) 123
# bash -s  -- 将 bash 后面的内容视为参数而不是选项
curl -sx $proxy https://raw.githubusercontent.com/holger2138/holger2138.github.io/main/docs/test.sh | sh -s 123
curl -sx $proxy https://raw.githubusercontent.com/holger2138/holger2138.github.io/main/docs/test.sh | sh -s -- 123
curl -sx $proxy https://raw.githubusercontent.com/holger2138/holger2138.github.io/main/docs/test.sh | sh /dev/stdin 123
```

## scp

```sh
# linux 文件传入 Windows
# 普通 windows 用户可能需要开启 openssh 服务 
# 终端管理员执行 net start sshd
scp file username@ip:/c:/

# 下载 linux 文件到时本地
# 对于 openwrt 可能会提示以下错误
# sh: /opt/libexec/sftp-server: not found scp: Connection closed 需要加 -O
scp admin@192.168.1.50:/tmp/home/root/dump.txt ./Desktop/test.txt
```
