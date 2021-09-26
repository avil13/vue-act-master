#!/bin/bash

FILTER_PATH="packages/docs"

COUNT_CHANGED_FILES=$(git diff --name-only HEAD~1 | grep $FILTER_PATH | wc -l)

if [ $COUNT_CHANGED_FILES -ne "0" ];
then
  echo 'TRUE';
fi
