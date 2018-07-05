import axios from 'axios';
import serialize from 'form-serialize';
import { isURL } from 'validator';
import parseRSS from './parser';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const isValidURL = (feed, value) => feed.every(({ link }) => link !== value) && isURL(value);

export const render = (container, getState, actions) => {
  const appContainer = container;
  appContainer.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="jumbotron">
            <form id="addChannel">
              <div class="form-group">
                <label for="rssFeed">RSS Feed</label>
                <input type="text" name="url" class="form-control" id="channelURL" placeholder="URL RSS Канала">
              </div>
              <button type="submit" class="btn btn-primary">Добавить</button>
            </form>
          </div>
        </div>
        <div class="col-12">
          <div id="feed"></div>
        </div>
      </div>
    </div>`;

  const form = document.querySelector('#addChannel');
  const input = document.querySelector('#channelURL');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const { feed, isLoading, inputURL } = getState();
    const { setLoading, addChannel } = actions;
    const { url } = serialize(this, { hash: true });
    if (isValidURL(feed, inputURL) && !isLoading) {
      setLoading(true);
      axios.get(`${CORS_PROXY}${url}`, { headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((response) => {
          const channelData = parseRSS(response.data);
          setLoading(false);
          addChannel({ ...channelData, link: url });
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  });

  input.addEventListener('input', function () {
    const { updateInputURL } = actions;
    updateInputURL(this.value);
  });
};

export const updateButton = (state) => {
  const { isLoading } = state;
  const button = document.querySelector('button[type="submit"]');
  if (isLoading) {
    button.setAttribute('disabled', true);
  } else {
    button.removeAttribute('disabled');
  }
};

export const updateInput = (state) => {
  const { inputURL, feed } = state;
  const input = document.querySelector('#channelURL');

  input.value = inputURL;

  if (inputURL.length > 0) {
    if (isValidURL(feed, inputURL)) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
  } else {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
  }
};

export const updateFeed = (state) => {
  const { feed } = state;
  const feedContent = document.querySelector('#feed');
  const feedList = feed.map((channel) => {
    const { title, items } = channel;
    return items.reduce((acc, post) => {
      const { title: postTitle, description } = post;
      return `${acc}
        <li>
          <a href="#" data-description="${description}">
            ${postTitle}
          </a>
        </li>`;
    }, `<h3>${title}</h3><ul>`);
  }).join('</ul>');

  feedContent.innerHTML = feedList;
};
