var Convolve = {};

/**
 * conv(array, mask)
 *
 * Convolves the mask with the array.  Example:
 * Convolve.conv([1, 2, 4, 9],[1, 1, 1]) = [1.5, 7/3, 5, 6.5]
 */
Convolve.conv = function(arr, mask) {
    if (mask.length % 2 == 0) {
        throw 'mask must be an array of positive, odd length';
    } else if (mask.length > arr.length) {
        throw 'mask must be smaller than array';
    }

    var newarr = [];
    var half = parseInt(mask.length / 2);
    for (i=0; i<arr.length; i++) {
        var start = i - half;
        var end = i + half;
        var offset = 0;
        if (start < 0) {
            offset = -start;
            start = 0;
        }
        if (end >= arr.length) {
            end = arr.length - 1;
        }

        var sum = 0;
        var masksum = 0;
        for (j=start; j<=end; j++) {
            sum += arr[j] * mask[j-start+offset];
            masksum += mask[j-start+offset];
        }
        newarr.push(sum / masksum);
    }

    return newarr;
}

/**
 * gauss(n)
 *
 * Returns a bellcurve-like array of length n (where n = 1,3,or 5)
 */
Convolve.gauss = function(n) {
    if (n == 1) return [1];
    else if (n == 3) return [1, 2, 1];
    else return [1, 2, 4, 2, 1];
}

/*
 * flat(n)
 *
 * returns a mask of all ones
 * Convolve.flat(5) = [1, 1, 1, 1, 1]
 */
Convolve.flat = function(n) {
    var rez = [];
    for (i=0; i<n; i++) rez.push(1);
    return rez;
}

