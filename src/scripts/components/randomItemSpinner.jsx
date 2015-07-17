import React from 'react';

/**
 * RandomItemSpinner Component
 */
class RandomItemSpinner extends React.Component {
    componentWillMount() {
        this.start(this.props.options.delay, this.buildPool());
    }

    /**
     * Spinner loops through an array with a specified delay and renders a react component
     * @param  { Int } delay
     * @param  { Array } items
     */
    start(delay, items) {

        /**
         * Our generator
         */
        function* generator() {
            let index = 0;
            for (let item of items) {
                item.currentStep = index++;
                setTimeout(onChange.bind(this), this.delayAlgorithm(item.currentStep, this.props.options.iterations, this.props.options.delay));
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
        var onChange = () => {
            let item = it.next();

            if (!item.value) {
                this.setState({ end: true });
                return;
            }

            this.playClick();
            this.setState({ end: false, randomItem: item });
        };

        onChange();
    }

    /**
     * Build a randomize array of items to spin through
     * @return { Array }
     */
    buildPool() {
        let pool = this.iterationsSpinnerList(this.props.options.iterations / this.props.items.length, this.props.items);
            pool = this.randomizeSpinnerArray(pool);
            pool = this.dedupeSiblings(pool);

        return pool;
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
     * @param  { Array } items
     * @return { Array }
     */
    randomizeSpinnerArray(items) {
        return items.sort(this.randOrd);
    }

    /**
     * Randomize functionality for sorting
     */
    randOrd() {
        return Math.round(Math.random()) - 0.5;
    }

    /**
     * Clones an array by 'n' amount of times
     * @param  { Int } multiplier
     * @param  { Array } items
     * @return { Array }
     */
    iterationsSpinnerList(multiplier, items) {
        let myArray = [];

        // Multiply the items Array by 'n' amount times
        for (let x = 0; x <= multiplier; x++) {
            myArray.push(items);
        }

        // Flatten
        return myArray.reduce(function(a, b) {
            return a.concat(b);
        });
    }

    /**
     * Removes duplicate sibblings that are adjacent to one another in an Array
     * @param  { Array } items
     * @return { Array }
     */
    dedupeSiblings(items) {
        return items.filter((value, index, array) => {
            if (value !== array[index - 1]) {
                return value;
            }
        });
    }

    /**
     * Event Handler to respin
     */
    spinAgainHandler() {
        this.start(this.props.options.delay, this.buildPool());
    }

    /**
     * Play Click Sound
     */
     playClick() {
         var isSafari = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1);
         if (!isSafari) {
             let audio = new Audio('mp3s/click.mp3');
             audio.play();
         }
     }

    /**
     * Render bender
     * @return { JSX }
     */
    render() {
        return (
            <div className="RandomItemSpinner">
                <RandomItem item={ this.state.randomItem.value } />
                <SpinAgainButton disabled={ !this.state.end } spinAgainHandler={ this.spinAgainHandler.bind(this) } />
            </div>
        );
    }
}

RandomItemSpinner.defaultProps = {
    options: {
        delay: 120,
        iterations: 60
    },
    items: []
};

RandomItemSpinner.displayName = 'RandomItemSpinner';
RandomItemSpinner.propTypes = {
    items: React.PropTypes.array.isRequired,
    options: React.PropTypes.object
};

/**
 * RandomItem Component
 */
class RandomItem extends React.Component {
    render() {
        return (
            <div className="RandomItem">
                <img className="RandomItem__img" src={ this.props.item.img } />
            </div>
        );
    }
}

RandomItem.defaultProps = {
    item: {
        name: null,
        img: null
    }
};

RandomItem.displayName = 'RandomItem';
RandomItem.propTypes = {
    item: React.PropTypes.object.isRequired
};

/**
 * SpinAgainButton Component
 */
class SpinAgainButton extends React.Component {
    render() {
        let disabled = this.props.disabled ? 'disabled' : '';

        return (
            <div className="SpinAgain">
                <button className="SpinAgain__button" disabled={ disabled } onClick={ this.props.spinAgainHandler }>&#9658;</button>
            </div>
        );
    }
}

SpinAgainButton.displayName = 'SpinAgainButton';
SpinAgainButton.propTypes = {
    disabled: React.PropTypes.bool.isRequired,
    spinAgainHandler: React.PropTypes.func
};

export default { RandomItemSpinner };
