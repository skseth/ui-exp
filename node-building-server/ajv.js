var Ajv = require('ajv'); // version >= 4.7.4
var ajv = new Ajv({ source: true }); // this option is required
var pack = require('ajv-pack');

var schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      pattern: '^[a-z]+$'
    }
  }
};

var validate = ajv.compile(schema);
var moduleCode = pack(ajv, validate);

// now you can
// 1. write module code to file
var fs = require('fs');
var path = require('path');
fs.writeFileSync(path.join(__dirname, '/validate.js'), moduleCode);

// 2. require module from string
var requireFromString = require('require-from-string');
var packedValidate = requireFromString(moduleCode);
