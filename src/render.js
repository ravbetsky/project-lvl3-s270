import axios from 'axios';
import serialize from 'form-serialize';
import $ from 'jquery';
import 'bootstrap/js/src/modal';
import { isURL } from 'validator';
import parseRSS from './parser';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const isValidURL = (feed, value) => feed.every(({ link }) => link !== value) && isURL(value);

export const init = (getState, actions) => {
  const form = document.getElementById('addChannel');
  const input = document.getElementById('channelURL');
  const modal = document.getElementById('modal');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const { feed, isLoading, inputURL } = getState();
    const { setLoading, addChannel, toggleAlert } = actions;
    const { url } = serialize(this, { hash: true });
    if (isValidURL(feed, inputURL) && !isLoading) {
      setLoading(true);
      axios.get(`${CORS_PROXY}${url}`, { headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((response) => {
          const channelData = parseRSS(response.data);
          setLoading(false);
          toggleAlert({ isShown: true, message: `RSS from ${url} was added!`, type: 'success' });
          addChannel({ ...channelData, link: url });
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          toggleAlert({ isShown: true, message: `Error adding ${url} to feed`, type: 'danger' });
        });
    }
  });

  input.addEventListener('input', function () {
    const { updateInputURL } = actions;
    updateInputURL(this.value);
  });

  $(modal).on('show.bs.modal', (event) => {
    const linkNode = $(event.relatedTarget);
    const { title, description } = linkNode.data();
    $(modal).find('.modal-title').text(title);
    $(modal).find('.modal-body').text(description);
  });
};

export const updateButton = (getState) => {
  const { isLoading } = getState();
  const button = document.querySelector('button[type="submit"]');
  if (isLoading) {
    button.setAttribute('disabled', true);
  } else {
    button.removeAttribute('disabled');
  }
};

export const updateInput = (getState) => {
  const { inputURL, feed } = getState();
  const input = document.getElementById('channelURL');

  input.value = inputURL;

  if (inputURL.length > 0) {
    const isValid = isValidURL(feed, inputURL);
    input.classList.toggle('is-invalid', !isValid);
    input.classList.toggle('is-valid', isValid);
  } else {
    input.classList.remove('is-invalid', 'is-valid');
  }
};

export const updateFeed = (getState) => {
  const { feed } = getState();
  const feedContent = document.getElementById('feed');
  const feedList = feed.map((channel) => {
    const { title, items } = channel;
    return items.reduce((acc, post) => {
      const { title: postTitle, description } = post;
      return `${acc}
        <li>
          <a href="#"
            data-toggle="modal"
            data-target="#modal"
            data-title="${postTitle}"
            data-description="${description}"
            >
            ${postTitle}
          </a>
        </li>`;
    }, `<h3>${title}</h3><ul>`);
  }).join('</ul>');

  feedContent.innerHTML = feedList;
};

export const updateAlert = (getState, actions) => {
  const { alert: { isShown, message, type } } = getState();
  const { toggleAlert } = actions;
  const alert = document.querySelector('[role="alert"]');
  const content = alert.querySelector('[role="message"]');
  const types = ['danger', 'success'];

  types.forEach(alertType => alert.classList.remove(`alert-${alertType}`));

  content.innerHTML = message;
  alert.style.pointerEvents = isShown ? 'all' : 'none';
  alert.style.opacity = Number(isShown);
  alert.classList.add(`alert-${type}`);

  alert.querySelector('[data-dismiss="alert"]').onclick = () => toggleAlert({ isShown: false });
};
