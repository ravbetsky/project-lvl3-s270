import _ from 'lodash';
import Storage from './storage';
import actions from './actions';
import { render, updateInput, updateButton, updateFeed } from './render';
import './scss/app.scss';

const initialState = {
  inputURL: '',
  isLoading: false,
  feed: [],
};

export default (container) => {
  const storage = new Storage(initialState);

  // Добавляем экшны
  _.keys(actions).forEach((key) => {
    storage.bindAction(key, actions[key]);
  });

  // Подписываемся на изменения
  storage.subscribe('isLoading', updateButton);
  storage.subscribe('inputURL', updateInput);
  storage.subscribe('feed', updateFeed);
  storage.subscribe('feed', () => console.log('Some feed changes made'));

  // Отрисовываем приложение
  render(container, () => storage.getState(), storage.actions);

  // Вручную обновляем всех подпсчиков
  storage.notifyAll();
};
