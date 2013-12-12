bugfree
=======

BugFree API Node.js client.

* [BugFree API document](http://bugfree.corp.taobao.com/doc/openapi3.html)

## Install

```bash
$ npm install bugfree
```

## Usage

```js
var bugfree = require('bugfree');

var client = bugfree.create({
  api: 'http://your-bugfree-host/api3.php',
  apiKey: 'your api key'
});

client.users.getsid(function (err, session) {
  console.log(session);
});
```

## Authors

```bash
$ git summary

 project  : bugfree
 repo age : 2 minutes
 active   : 1 days
 commits  : 1
 files    : 12
 authors  :
     1  fengmk2                 100.0%
```

## License

(The MIT License)

Copyright (c) 2013 fengmk2 &lt;fengmk2@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
