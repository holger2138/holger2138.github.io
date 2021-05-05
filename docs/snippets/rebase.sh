#!/bin/sh

set -e

echo "正在创建中……"
{
  mkdir learn-git && cd $_

  git init

  echo -e "rebase.log\n.gitignore" >>.gitignore

  for i in a b c d; do
    echo $i >>a.txt
    git add a.txt
    git commit -m "add $i"
    sleep 3
  done

  git branch dev

  arr=('e dev' 'f master' 'g dev' 'h master')

  for i in "${arr[@]}"; do
    content=${i:0:1} branch=${i:2}
    git switch $branch
    echo $content >>a.txt
    git commit -am "add $content"
    sleep 3
  done

  glog='git log --format="%Cred%h  %CresetCD:%Cgreen%cI  %CresetAD:%Cgreen%aI  %Cblue%an  %Cgreen%s  %Cred%D"'

  eval $glog master >>rebase.log
  echo >>rebase.log

  eval $glog dev >>rebase.log
  git switch dev
} &>/dev/null

echo '创建完成！'
