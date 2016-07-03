(() => {
  window._ = {};
  const _ = window._;
  // returns input value
  _.identity = (val) =>
    val;

  // returns first element(s)
  _.first = (array, n) =>
    (n === undefined ? array[0] : array.slice(0, n));

  // returns last element(s)
  _.last = (array, n) =>
    (n === undefined ? array[array.length - 1] : array.slice(Math.max(0, array.length - n)));

  // iterate through the collection and executes the callback on each element
  _.each = (collection, iterator) => {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else {
      const props = Object.keys(collection);

      for (let i = 0; i < props.length; i++) {
        iterator(collection[props[i]], props[i], collection);
      }
    }
  };

  // gets the first index at which a specified element can be found in an array
  _.indexOf = (array, target) => {
    let result = -1;

    _.each(array, (item, index) => {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = (collection, test) => {
    const result = [];

    _.each(collection, (element, prop, object) => {
      if (test(element, prop, object)) {
        result.push(element);
      }
    });

    return result;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = (collection, test) =>
    _.filter(collection, (element, prop, object) =>
      (!test(element, prop, object)));

  // Produce a duplicate-free version of the array.
  _.uniq = (array) => {
    const uniqArray = [];
    uniqArray.push(array[0]);

    for (let i = 1; i < array.length; i++) {
      if (array[i] !== array[0] && _.indexOf(array.slice(i + 1), array[i]) === -1) {
        uniqArray.push(array[i]);
      }
    }

    return uniqArray;
  };


  // Return the results of applying an iterator to each element.
  _.map = (collection, iterator) => {
    const result = [];

    _.each(collection, (element, prop, object) => {
      result.push(iterator(element, prop, object));
    });

    return result;
  };

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = (collection, key) =>
     _.map(collection, (element) =>
       element[key]);

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as its second argument.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  //
  //   var identity = _.reduce([5], function(total, number){
  //     return total + number * number;
  //   }); // should be 5, regardless of the iterator function passed in
  //          No accumulator is given so the first element is used.
  _.reduce = (collection, iterator, initialValue) => {
    let firstElement = initialValue;
    let reduced;

    _.each(collection, (element) => {
      if (!firstElement) {
        reduced = element;
        firstElement = true;
      } else {
        reduced = iterator(reduced, element);
      }
    });

    return reduced;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = (collection, target) =>
    _.reduce(collection, (wasFound, element) =>
      wasFound || (element === target)
    , false);


  // Determine whether all of the elements match a truth test.
  _.every = (collection, iterator) => {
    let callback;
    if (!iterator) {
      callback = _.identity;
    } else {
      callback = iterator;
    }

    return !!_.reduce(collection, (accumulator, element) =>
      (accumulator && callback(element))
    , true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = (collection, iterator) => {
    let callback;
    if (!iterator) {
      callback = _.identity;
    } else {
      callback = iterator;
    }

    return !!_.reduce(collection, (accumulator, element) =>
      (accumulator || callback(element))
    , false);
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = (...collection) => {
    for (let i = 1; i < collection.length; i++) {
      const props = Object.keys(collection[i]);
      for (let j = 0; j < props.length; j++) {
        collection[0][props[j]] = collection[j][props[j]];
      }
    }

    return collection[0];
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    for (var i = 1; i < arguments.length; i++) {
      for (var prop in arguments[i]) {
        if (!(prop in arguments[0]))
          arguments[0][prop] = arguments[i][prop]; 
      }
    }

    return arguments[0];
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function only takes primitives as arguments.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var storage = {};

    return function(key) {
      if (key in storage)
        return storage[key];
      else
        return storage[key] = func.apply(this, arguments);
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var parameters = Array.prototype.slice.call(arguments, 2);

    return setTimeout(function() {
      func.apply(this, parameters);
    }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    var shuffledArray = array.slice();

    for (var i = shuffledArray.length; i > 0; i--) {
      var r = Math.floor(Math.random() * i);
      var temp = shuffledArray[i-1];
      shuffledArray[i-1] = shuffledArray[r];
      shuffledArray[r] = temp; 
    }

    return shuffledArray;
  };


  /**
   * EXTRA CREDIT
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, otherArgs) {
    var func = typeof functionOrKey === 'function';

    return _.map(collection, function(element) {
      return func ? functionOrKey.apply(element, otherArgs) : element[functionOrKey]();
    });
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
    var func = typeof iterator === 'function';

    return collection.sort(function(a, b) {
      if (func) {
        a = iterator(a), b = iterator(b);
      } else {
        a = a[iterator], b = b[iterator];
      }

      if (a < b) 
        return -1;
      else if (a > b)
        return 1;
      else
        return 0;
    });
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var first = true;

    return _.reduce(arguments, function(accumulator, element) {
      if (accumulator.length < element.length) 
        var len = element.length;
      else
        var len = accumulator.length;

      if (first) {
        var firstAccumulator = []; 
        first = false;

        for (var i = 0; i < len; i++)
          firstAccumulator.push(new Array(accumulator[i], element[i]));

        return firstAccumulator;
      }

      for (var i = 0; i < len; i++)
        accumulator[i].push(element[i]);

      return accumulator;
    });
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
    var cooldown = (new Date()).getTime();

    return function() {
      if ((new Date()).getTime() > cooldown) {
        cooldown = (new Date()).getTime() + wait;

        return func.apply(this, arguments);
      }
    };
  };
})();
