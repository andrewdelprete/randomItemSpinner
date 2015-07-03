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

var runFrameworkSpinner = function() {
    React.render(<RandomItemSpinner element={ document.getElementById('app') } items={ frameworks } renderComponent={ FrameworkItem } />, document.getElementById('app'));
};
