import React from 'react';
import { RandomItemSpinner } from './components/randomItemSpinner';

var frameworks = [
    { name: 'AngularJS', img: 'imgs/angularjs.png' },
    { name: 'Backbone', img: 'imgs/backbone.png' },
    { name: 'EmberJS', img: 'imgs/emberjs.png' },
    { name: 'ExtJS', img: 'imgs/extjs.png' },
    { name: 'jQuery', img: 'imgs/jquery.png' },
    { name: 'KnockOut', img: 'imgs/knockoutjs.png' },
    { name: 'Meteor', img: 'imgs/meteor.png' },
    { name: 'ReactJS', img: 'imgs/reactjs.png' },
    { name: 'VueJS', img: 'imgs/vuejs.png' },
    { name: 'YUI', img: 'imgs/yuijs.png' }
];

/**
 * Preload images asynchronously
 * @param  { Array } imageArray
 * @param  { Int } index
 */
function preload(imageArray, index) {
    index = index || 0;
    if (imageArray && imageArray.length > index) {
        var img = new Image();
        img.onload = function() {
            preload(imageArray, index + 1);
        };
        img.src = imageArray[index].img;
    } else {
        runFrameworkSpinner();
    }
}

preload(frameworks);

/**
 * The JSX we're going to render on each iteration.
 * @return { JSX }
 */
var FrameworkItem = function() {
    return (
        <div className="FrameworkItem">
            <img className="FrameworkItem__img" src={ this.randomItem.value.img } />
        </div>
    );
};

/**
 * The Spin Again Button
 */
var spin = document.getElementById('spin');

/**
 * Enable Spin Button
 */
function enableSpinButton() {
    spin.removeAttribute('disabled');
}

/**
 * Disable Spin Button
 */
function disableSpinButton() {
    spin.setAttribute('disabled', 'disabled');
}

/**
 * Play click sound and disable spin button
 */
function playClickAndDisableSpinButton() {
    disableSpinButton();

    var isSafari = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1);
    if (!isSafari) {
        let audio = new Audio('mp3s/click.mp3');
        audio.play();
    }
}

var runFrameworkSpinner = function(reInit) {
    React.render(<RandomItemSpinner element={ document.getElementById('app') } items={ frameworks } onChangeCallback={ playClickAndDisableSpinButton } onChangeEndCallback={ enableSpinButton } reInit={ reInit } renderJSX={ FrameworkItem } />, document.getElementById('app'));
};

/**
 * Attach Event Listener to Spin button and re run spinner
 */
spin.addEventListener('click', runFrameworkSpinner.bind(null, true), false);
