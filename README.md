# bloom-bench

benchmark all the bloomfilter implementations available on npm.

## Method

Generate N unique strings, and measure the time to add them,
to bloomfilter (will be `sha256(n)` as base64)
then test whether each string is in the filter,
and check wether another N unique strings are not in the fliter.

In my experiment, I used N=100000, and requested a filter with P=0.001 chance of collision.

All results are given as ops per second.
(so that if a run of one measurement takes longer than 1 second, it can be stopped)

## Results

```
module-name, add, +test, -test
jsbloom_notrycatch, 219780, 225225, 238663
jsbloom, 171233, 230947, 238095
bloom-filter-cpp, 218818, 210970, 235294
bloomfilter, 170068, 170068, 173310
bloom-lite, 77151, 114811, 103520
bloem, 72493, 76923, 78218
bloom-filter-js, 16441, 16865, 16346
bloomxx, 556, 564, 5372
```

Since `jsbloom` avoids compiling C++ and also is very fast, it's clearly the best choice.
Also, with a [small change](https://github.com/cry/jsbloom/pull/1) it becomes the fastest _hands down_.

## other results

learning more here, if you use a short string, it's a lot faster,
here I altered the script slightly to use numbers instead of hashes.
This shows that some implementations handle this situation better,
and overall, ops/second are much higher, because it removes the time
to perform sha256, and also because it's shorter string.

```
module-name, add, +test, -test
jsbloom_notrycatch, 1818182, 1369863, 2857143
jsbloom, 531915, 1315789, 1724138
bloom-filter-cpp, 2127660, 2272727, 2222222
bloomfilter, 444444, 406504, 438596
bloom-lite, 105263, 194932, 155039
bloem, 131926, 143266, 141243
bloom-filter-js, 105042, 103950, 99602
bloomxx, 580, 576, 5666
```

The performance of my `jsbloom` fork is moved significantly ahead of `jsbloom`,
but has fallen behing `bloom-filter-cpp`.

## License

MIT

