# Формирование form по JSON шаблону

  Контейнеры
  Компоненты
## Шаблон контейнера

```
{
      "type": "Name of container", //requred
      "key": "unique key", //requred
      "width": 4,
      "options" : { // all fall into the component as props
        "label": "hello",
        "tabIndex": 1
      }
      "children": [ // components or containers what render in container // requred
        {
          "type": "HierarchicalHandbook",
          "key": "Перенесенные заболевания",
          "width": 12,
          "validation": {
            "required": false,
            "unique": false
          }
        }
      ]
    }
```
## Шаблон компонента

```
{
  "type": "Name of component", //requred
  "key": "unique key", //requred
  "width": 12,
  "options": { // all fall into the component as props
    "data": [
      "option 1",
      "option 2",
      "option 3",
      "option 4",
      "option 5",
      "option 6"
    ]
  }
```