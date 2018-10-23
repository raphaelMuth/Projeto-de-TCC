void function () {

    var
        bind = Function.prototype.bind,
        liberate = bind.bind(Function.prototype.call),
        reduce = liberate(Array.prototype.reduce);

    function multiplier(x) {

        var parts = x.toString().split('.');

        if (parts.length < 2) {
            return 1;
        }

        return Math.pow(10, parts[1].length);
    }

    function correctionFactor() {

        return reduce(arguments, function (prev, next) {

            var mp = multiplier(prev),
                mn = multiplier(next);

            return mp > mn ? mp : mn;

        }, -Infinity);

    }

    Math.add = function () {

        var corrFactor = correctionFactor.apply(null, arguments);

        function cback(accum, curr, currI, O) {
            return accum + corrFactor * curr;
        }

        return reduce(arguments, cback, 0) / corrFactor;
    }

    Math.sub = function () {

        var corrFactor = correctionFactor.apply(null, arguments),
            first = arguments[0];

        function cback(accum, curr, currI, O) {
            return accum - corrFactor * curr;
        }

        delete arguments[0];

        return reduce(arguments,
            cback, first * corrFactor) / corrFactor;
    }

    Math.mul = function () {

        function cback(accum, curr, currI, O) {

            var corrFactor = correctionFactor(accum, curr);

            return (accum * corrFactor) * (curr * corrFactor) /
                (corrFactor * corrFactor);
        }

        return reduce(arguments, cback, 1);
    }

    Math.div = function () {

        function cback(accum, curr, currI, O) {

            var corrFactor = correctionFactor(accum, curr);

            return (accum * corrFactor) / (curr * corrFactor);
        }

        return reduce(arguments, cback);
    }

}();