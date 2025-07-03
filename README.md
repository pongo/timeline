# pongo-timeline

Очень простой трекер времени. https://pongo.github.io/timeline/

<img src="https://github.com/user-attachments/assets/fa79df04-06fa-41f9-84cb-b24ea9bcc5eb" width="590">

<img src="https://github.com/user-attachments/assets/8a91aaa2-dfd8-45c8-9346-dfc2062a3374" width="529">

## Где хранятся данные

Данные хранятся в браузере (в localstorage). Чтобы очистить данные, запустите в консоли: 
```js
localStorage.removeItem('pongo-timeline-schedule')
```
## Технические детали

### Верстка

Написан на Vue. Сверстан с помощью css grid: каждая минута — это отдельная колонка (ну да, получилось [1440 колонок](https://github.com/pongo/timeline/blob/3e316d14e44fe4371c2e7481fd80bc016f792f3d/css/schedule.css#L7) 😎). Блоки рисуются, задавая в [grid-column-start и grid-column-end](https://github.com/pongo/timeline/blob/3e316d14e44fe4371c2e7481fd80bc016f792f3d/css/schedule.css#L42) начало и продолжительность в минутах. Всё просто.

### Functional Core, Imperative Shell

Мне было интересно попробовать этот подход. Попытался таким образом реализовать [useSchedule](https://github.com/pongo/timeline/blob/3e316d14e44fe4371c2e7481fd80bc016f792f3d/js/schedule.js), возвращающий shallowRef. [Тесты](https://github.com/pongo/timeline/blob/3e316d14e44fe4371c2e7481fd80bc016f792f3d/js/schedule.test.js). В принципе, довольно удобно. 

### Что было изучено

- [x] Использование type="module" и type="importmap" без инструментов сборки.
- [x] Верстка с помощью css grid, включая имена треков и css переменные.
- [x] Реализация логики с помощью паттерна FCIS.
- [x] Загрузка сайта на github pages.
