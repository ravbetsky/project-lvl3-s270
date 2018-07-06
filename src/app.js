import _ from 'lodash';
import Storage from './storage';
import actions from './actions';
import { init, updateInput, updateButton, updateFeed, updateAlert } from './render';
import './scss/app.scss';

const initialState = {
  alert: {
    message: '',
    type: 'danger',
    isShown: false,
  },
  inputURL: '',
  isLoading: false,
  feed: [],
};

export default () => {
  const storage = new Storage(initialState);

  // Добавляем экшны
  _.keys(actions).forEach((key) => {
    storage.bindAction(key, actions[key]);
  });

  // Подписываемся на изменения
  storage.subscribe('isLoading', updateButton);
  storage.subscribe('inputURL', updateInput);
  storage.subscribe('feed', updateFeed);
  storage.subscribe('alert', updateAlert);
  storage.subscribe('init', init);

  // Вручную обновляем всех подпсчиков
  storage.notifyAll();
};
