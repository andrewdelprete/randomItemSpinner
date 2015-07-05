import React from 'react';

/**
 * RandomItemSpinner Component
 */
class RandomItemSpinner extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Run after component mounts the donkey
     */
    componentDidMount() {
        this.init(this.props.options.delay);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.reInit) {
            this.init();
        }
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
                setTimeout(onChange.bind(this, this.props.onChangeCallback, this.props.onChangeEndCallback), this.delayAlgorithm(item.currentStep, this.props.options.iterations, this.props.options.delay));
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
        var onChange = (onChangeCallback, onChangeEndCallback) => {
            let item = it.next();

            if (item.value) {
                if (onChangeCallback) {
                    onChangeCallback.call(this);
                }

                React.render(<RandomItemSpinner element={ this.props.element } items={ this.props.items } onChangeCallback={ this.props.onChangeCallback } onChangeEndCallback={ this.props.onChangeEndCallback } options={ this.props.options } randomItem={ item } renderJSX={ this.props.renderJSX } />, this.props.element);
            } else {
                onChangeEndCallback();
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
     * Removes duplicate sibblings that are adjacent to one another in an Array
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
     * @param  { Int } delay
     *
     * @TODO - Clean this up to chain somehow
     */
    init() {
        let spinnerList = this.iterationsSpinnerList(this.props.options.iterations / this.props.items.length, this.props.items);
            spinnerList = this.randomizeSpinnerArray(spinnerList);
            spinnerList = this.dedupeSiblings(spinnerList);


        this.spinner(this.props.options.delay, spinnerList);
    }

    /**
     * Render bender
     * @return { JSX }
     */
    render() {
        return this.props.renderJSX();
    }
}

RandomItemSpinner.defaultProps = {
    options: {
        delay: 120,
        iterations: 60
    },
    reInit: false,
    randomItem: { value: { name: '', img: '', steps: 0 } }
};

RandomItemSpinner.displayName = 'RandomItemSpinner';
RandomItemSpinner.propTypes = {
    element: React.PropTypes.object.isRequired,
    items: React.PropTypes.array.isRequired,
    onChangeCallback: React.PropTypes.func,
    onChangeEndCallback: React.PropTypes.func,
    options: React.PropTypes.object,
    randomItem: React.PropTypes.object,
    reInit: React.PropTypes.func,
    renderJSX: React.PropTypes.func.isRequired
};
export default { RandomItemSpinner };
