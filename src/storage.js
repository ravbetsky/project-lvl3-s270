import { keys } from 'lodash';
import { diff } from 'deep-object-diff';
import EventEmitter from 'events';

export default class Storage {
  constructor(state = {}) {
    this.state = { ...state };
    this.actions = {};
    this.events = new Set();
    this.eventEmitter = new EventEmitter();
  }

  subscribe(event, callback) {
    this.events.add(event);
    this.eventEmitter.on(event, callback);
  }

  notify(event) {
    this.eventEmitter.emit(event, () => this.getState(), this.actions);
  }

  notifyAll() {
    [...this.events].forEach(event => this.notify(event));
  }

  getState() {
    return this.state;
  }

  bindAction(name, fn) {
    this.actions = {
      ...this.actions,
      [name]: (data) => {
        const newState = fn(this.state, data);
        const difference = diff(this.state, newState);
        this.state = newState;
        keys(difference).forEach((key) => {
          this.notify(key);
        });
      },
    };
  }
}
