#!/bin/bash

# Проверяем, передан ли аргумент (путь к директории)
if [ -z "$1" ]; then
  echo "Использование: $0 <путь_к_директории>"
  exit 1
fi

DIRECTORY="$1"

# Проверяем, существует ли директория
if [ ! -d "$DIRECTORY" ]; then
  echo "Ошибка: Директория '$DIRECTORY' не найдена."
  exit 1
fi

# Инициализируем счетчики
TXT_COUNT=0
EXE_COUNT=0
EMPTY_DIR_COUNT=0

echo "--- Анализ директории '$DIRECTORY' ---"

# Проходим по всем элементам в директории
for item in "$DIRECTORY"/*; do
  if [ -f "$item" ]; then # Если это файл
    if [[ "$item" == *.txt ]]; then
      echo "Файл: $(basename "$item") (TXT)"
      head -n 3 "$item"
      echo "---"
      ((TXT_COUNT++))
    elif [ -x "$item" ]; then
      echo "Файл: $(basename "$item") (Исполняемый)"
      echo "Размер: $(du -h "$item" | cut -f1)"
      echo "---"
      ((EXE_COUNT++))
    fi
  elif [ -d "$item" ]; then # Если это директория
    if [ -z "$(ls -A "$item")" ]; then # Проверяем, пустая ли она
      echo "Предупреждение: Пустая директория: $(basename "$item")"
      echo "---"
      ((EMPTY_DIR_COUNT++))
    fi
  fi
done

echo "--- Статистика ---"
echo "Найдено: $TXT_COUNT txt, $EXE_COUNT exe, $EMPTY_DIR_COUNT пустых папок"


