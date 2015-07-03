import React from 'react';
import assign from 'lodash.assign';

/**
 * RandomItemSpinner Component
 */
class RandomItemSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.defaults = {
            delay: 120,
            iterations: 60
        };

        this.settings = assign({}, this.defaults, this.props.options);

        this.randomItem = null;
    }

    /**
     * Run after component mounts the donkey
     */
    componentDidMount() {
        this.init(this.settings.delay);
    }

    /**
     * Set delay for next iternation - run at normal speed until iterations hits 60% of total then slow down gradually
     * @return { Int }
     */
    delayAlgorithm(currentStep, iterations, delay) {
        if (currentStep > (iterations * .70)) {
            let stepsRemainingCounter = (currentStep - (iterations * .70));
            return delay + (stepsRemainingCounter * stepsRemainingCounter);
        }

        return delay;
    }

    /**
     * Randomize an Array
     * @param  { Array } spinnerArray
     * @return { Array }
     */
    randomizeSpinnerArray(spinnerArray) {
        return spinnerArray.sort(this.randOrd);
    }

    /**
     * Randomize functionality for sorting
     */
    randOrd() {
        return Math.round(Math.random()) - 0.5;
    }

    /**
     * Spinner loops through an array with a specified delay and renders a react component
     * @param  { Int } delay
     * @param  { Array } spinnerArray
     */
    spinner(delay, spinnerArray) {

        /**
         * Our generator
         */
        function* generator() {
            let index = 0;
            for (let item of spinnerArray) {
                item.currentStep = index++;
                setTimeout(onChange.bind(this, this.props.onChangeCallback), this.delayAlgorithm(item.currentStep, this.settings.iterations, this.settings.delay));
                yield item;
            }
        }

        /**
         * Instantiate generator
         */
        var it = generator.call(this);

        /**
         * onChange iterator
         */
        var onChange = (callback) => {
            let item = it.next();

            if (item.value) {
                if (callback) {
                    callback();
                }
                
                React.render(<RandomItemSpinner element={ this.props.element } items={ this.props.items } onChangeCallback={ this.props.onChangeCallback } options={ this.props.options } randomItem={ item } renderComponent={ this.props.renderComponent } />, this.props.element);
            }
        };

        onChange();
    }

    /**
     * Clones an array by 'n' amount of times
     * @param  { Int } multiplier
     * @param  { Array } spinnerList
     * @return { Array }
     */
    iterationsSpinnerList(multiplier, spinnerList) {
        let myArray = [];

        // Multiply the spinnerList Array by 'n' amount times
        for (let x = 0; x <= multiplier; x++) {
            myArray.push(spinnerList);
        }

        // Flatten
        return myArray.reduce(function(a, b) {
            return a.concat(b);
        });
    }

    /**
     * Removes duplicate sibblings tha are adjacent to one another in an Array
     * @param  { Array } spinnerList
     * @return { Array }
     */
    dedupeSiblings(spinnerList) {
        return spinnerList.filter((value, index, array) => {
            if (value !== array[index - 1]) {
                return value;
            }
        });
    }

    /**
     * Initialize - Render and start spinner
     * @param  {int} delay
     *
     * @TODO - Clean this up to chain somehow
     */
    init() {
        let spinnerList = this.iterationsSpinnerList(this.settings.iterations / this.props.items.length, this.props.items);
            spinnerList = this.randomizeSpinnerArray(spinnerList);
            spinnerList = this.dedupeSiblings(spinnerList);


        this.spinner(this.settings.delay, spinnerList);
    }

    /**
     * Render bender
     * @return { jsx }
     */
    render() {
        return this.props.renderComponent();
    }
}

RandomItemSpinner.defaultProps = {
    element: {},
    items: [],
    options: {},
    onChangeCallback: function() {},
    randomItem: { value: { name: '', img: '', steps: 0 } },
    renderComponent: function() {}
};

RandomItemSpinner.displayName = 'RandomItemSpinner';

export default { RandomItemSpinner };
