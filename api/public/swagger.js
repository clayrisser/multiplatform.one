/*
 *  File: /public/swagger.js
 *  Project: app
 *  File Created: 18-09-2023 08:18:07
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const OPEN_MODAL_BUTTON_SELECTOR = '#swagger-ui div.swagger-ui div.scheme-container section button';
const AUTHORIZE_BUTTON_SELECTOR =
  '#swagger-ui div.swagger-ui div.scheme-container section div.modal-ux div.modal-ux-content > div:nth-child(2) button[type=submit]';
const INPUT_SELECTOR =
  '#swagger-ui div.swagger-ui div.scheme-container section div.modal-ux div.modal-ux-content > div:nth-child(2) section input[type=text]';
const CLOSE_MODAL_SELECTOR =
  '#swagger-ui div.swagger-ui div.scheme-container section div.modal-ux div.modal-ux-header button';

const urlParams = new URLSearchParams(window.location.search);
const logger = console;

window.setTimeout(() => {
  const accessToken = urlParams.get('access_token');
  const openModalElement = window.document.querySelector(OPEN_MODAL_BUTTON_SELECTOR);
  if (openModalElement.innerHTML.toLowerCase().indexOf('href="#locked"') <= -1 && accessToken) {
    openModalElement.click();
    const inputElement = window.document.querySelector(INPUT_SELECTOR);
    if (inputElement) {
      setInputValue(inputElement, accessToken);
      window.document.querySelector(AUTHORIZE_BUTTON_SELECTOR).click();
    }
    const closeModalElement = window.document.querySelector(CLOSE_MODAL_SELECTOR);
    if (closeModalElement) closeModalElement.click();
    logger.info('authorized');
  }
  if (accessToken) {
    logger.info('access token ->');
    logger.info(accessToken);
  }
}, 500);

function setInputValue(inputElement, value) {
  const previousInputValue = inputElement.value;
  inputElement.value = value;
  const inputEvent = new Event('input', {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  inputEvent.simulated = true;
  const inputTracker = inputElement._valueTracker;
  if (inputTracker) {
    inputTracker.setValue(previousInputValue);
  }
  inputElement.dispatchEvent(inputEvent);
}
