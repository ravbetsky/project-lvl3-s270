import { findIndex } from 'lodash';

export const addChannel = (state, data) => {
  const { feed } = state;
  return { ...state, feed: [data, ...feed] };
};

export const updateInputURL = (state, data) => ({ ...state, inputURL: data });

export const updateChannel = (state, data) => {
  const { feed } = state;
  const { link: linkToUpdate, items: newItems } = data;
  const channelIndex = findIndex(feed, ({ link }) => link === linkToUpdate);

  const newFeed = feed.map((channel, index) => {
    if (index === channelIndex) {
      const { items: oldItems } = channel;
      return { ...channel, items: [...newItems, ...oldItems] };
    }
    return channel;
  });

  return { ...state, feed: newFeed };
};

export const toggleAlert = (state, data) => {
  const { alert } = state;
  return { ...state, alert: { ...alert, ...data } };
};

export const setLoading = (state, data) => ({ ...state, isLoading: data });

export default {
  addChannel,
  updateChannel,
  updateInputURL,
  setLoading,
  toggleAlert,
};
