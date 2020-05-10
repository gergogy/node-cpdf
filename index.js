'use strict';

const cpdf = require('./lib/bin');
const getTemporaryFilePath = require('./lib/tmp-file');

function countPages(filePath) {
  return cpdf('Counting pages', `-pages ${filePath}`)
  .then(out => parseInt(out));
}

function merge(filePaths, output) {
  output = output || getTemporaryFilePath();

  return cpdf('Merging', `${filePaths.join(' ')} -o ${output}`)
  .then(() => output);
}

function split(filePath, dest) {
  return cpdf('Splitting', `-split ${filePath} -o ${dest}`);
}

function write(blankFile, args, output) {
  output = output || getTemporaryFilePath();

  return cpdf('Writing file', `${blankFile} ${args} -o ${output}`)
  .then(() => output);
}

function pageInfo(filePath, range) {
  return cpdf('PageInfo', `-page-info ${filePath}${range ? ` ${range}` : ''}`);
}

/****************************************************************
 * Check in https://www.coherentpdf.com/cpdfmanual.pdf Page #15 *
 * cpdf -mediabox "<x> <y> <w> <h>" in.pdf [<range>] -o out.pdf *
 * args: { newBox: [Number][, range: String] }                  *
 *   - newBox is required                                       *
 *   - range is optional                                        *
 ****************************************************************/
function mediaBox(filePath, args, output) {
  output = output || getTemporaryFilePath();

  const box = args.newBox.join(' ');
  const range = args.range ? ` ${args.range}` : '';

  return cpdf('Modify MediaBox', `-mediabox "${box}" ${filePath}${range} -o ${output}`);
}

/****************************************************************
 * Check in https://www.coherentpdf.com/cpdfmanual.pdf Page #15 *
 * cpdf -crop "<x> <y> <w> <h>" in.pdf [<range>] -o out.pdf     *
 * Note: -cropbox switch won't work with this older version     *
 * args: { newBox: [Number][, range: String] }                  *
 *   - newBox is required                                       *
 *   - range is optional                                        *
 ****************************************************************/
function cropBox(filePath, args, output) {
  output = output || getTemporaryFilePath();

  const box = args.newBox.join(' ');
  const range = args.range ? ` ${args.range}` : '';

  return cpdf('Modify CropBox', `-cropbox "${box}" ${filePath}${range} -o ${output}`);
}

/****************************************************************
 * Check in https://www.coherentpdf.com/cpdfmanual.pdf Page #58 *
 * cpdf -blacktext in.pdf -o out.pdf                            *
 * Note: Blackens all text on the given pages,                  *
 *       which are not outlines.                                *
 *       Contrary to its name, this operation can               *
 *       use another color, if specified with -color.           *
 * args: { color }                                              *
 *   - color is optional                                        *
 ****************************************************************/
function blacktext(filePath, args, output) {
  output = output || getTemporaryFilePath();

  let command = '-blacktext';

  if (args.color) {
    command = `${command} -color "${args.color}"`;
  }

  return cpdf('Blacktext', `${command} ${filePath} -o ${output}`);
}

/****************************************************************
 * Check in https://www.coherentpdf.com/cpdfmanual.pdf Page #58 *
 * cpdf -blacklines in.pdf -o out.pdf                           *
 * Note: Blackens all lines on the given pages.                 *
 *       Contrary to its name, this operation can               *
 *       use another color, if specified with -color.           *
 * args: { color }                                              *
 *   - color is optional                                        *
 ****************************************************************/
function blacklines(filePath, args, output) {
  output = output || getTemporaryFilePath();

  let command = '-blacklines';

  if (args.color) {
    command = `${command} -color "${args.color}"`;
  }

  return cpdf('Blacklines', `${command} ${filePath} -o ${output}`);
}

/****************************************************************
 * Check in https://www.coherentpdf.com/cpdfmanual.pdf Page #58 *
 * cpdf -blackfills in.pdf -o out.pdf                           *
 * Note: Blackens all fills on the given pages.                 *
 *       Contrary to its name, this operation can               *
 *       use another color, if specified with -color.           *
 * args: { color }                                              *
 *   - color is optional                                        *
 ****************************************************************/
function blackfills(filePath, args, output) {
  output = output || getTemporaryFilePath();

  let command = '-blackfills';
  if (args.color) {
    command = `${command} -color "${args.color}"`;
  }

  return cpdf('Blackfills', `${command} ${filePath} -o ${output}`);
}

module.exports = {
  countPages,
  merge,
  split,
  write,
  pageInfo,
  mediaBox,
  crop: cropBox,
  cropBox,
  blacktext,
  blacklines,
  blackfills
};
