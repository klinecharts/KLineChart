// From https://github.com/mattjcowan/vitepress/blob/with-lunr-search/docs/components/search/lunr_build.js

const path = require('path');
const fs = require('fs');
const lunr = require('lunr');
const cheerio = require('cheerio');

const rootDirectory = process.cwd()

// Change these constants to suit your needs
const HTML_FOLDER = path.join(rootDirectory, 'website');
const SEARCH_FIELDS = ['l0', 'l1', 'l2', 'l3', 'l4', 'l5', 'l6'];
const EXCLUDE_FILES = [];
const MAX_PREVIEW_CHARS = 128; // Number of characters to show for a given search result
const OUTPUT_INDEX = path.join(rootDirectory, 'docs', '.vitepress', 'components', 'search', 'lunrData.js'); // Index file

console.log(process.cwd())

function isHtml(filename) {
  lower = filename.toLowerCase();
  return lower.endsWith('.htm') || lower.endsWith('.html');
}

function findHtml(folder) {
  if (!fs.existsSync(folder)) {
    console.log('Could not find folder: ', folder);
    return;
  }

  const files = fs.readdirSync(folder);
  const htmls = [];
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(folder, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      var recursed = findHtml(filename);
      for (var j = 0; j < recursed.length; j++) {
        recursed[j] = path.join(files[i], recursed[j]).replace(/\\/g, '/');
      }
      htmls.push.apply(htmls, recursed);
    } else if (isHtml(filename) && !EXCLUDE_FILES.includes(files[i])) {
      htmls.push(files[i]);
    }
  }
  return htmls;
}

function parseHeading($h) {
  return $h
    ? {
        t: ($h.text() || '').split('#')[0].trim(),
        a: ($h.attr() || {}).id,
      }
    : null;
}

function parseHtmlForEntries(folder, file, fileId) {
  let filename = path.join(folder, file);
  let html = fs.readFileSync(filename).toString();
  let $ = cheerio.load(html);

  let title = $('title').text();
  if (typeof title == 'undefined') title = file;
  title = title.split('|')[0].trim();

  let section = $('meta[name=section]').attr('content');
  if (typeof section == 'undefined') section = 'Documentation';

  let description = $('meta[name=description]').attr('content');
  if (typeof description == 'undefined') description = '';

  let keywords = $('meta[name=keywords]').attr('content');
  if (typeof keywords == 'undefined') keywords = '';

  let body = $('.container').text();
  if (typeof body == 'undefined') body = $('body').text();
  if (typeof body == 'undefined') body = '';

  let idx = 0;
  const entries = [];
  const h1 = parseHeading($('h1')) || { t: title, a: '' };
  if (h1 && h1.t) {
    entries.push({
      id: `${fileId}-${idx++}`,
      link: file,
      l0: section,
      l1: h1.t,
      l2: null,
      l3: null,
      l4: null,
      l5: null,
      l6: null,
      d: description,
    });
  }
  let h2 = '',
    h3 = '',
    h4 = '',
    h5 = '',
    h6 = '';
  $('h2, h3, h4, h5, h6').each((_, e) => {
    const $e = $(e);
    let add = null;
    switch (e.tagName) {
      case 'h2':
        h3 = h4 = h5 = h6 = null;
        h2 = parseHeading($e);
        add = h2.a;
        break;
      case 'h3':
        h4 = h5 = h6 = null;
        if (h2) {
          h3 = parseHeading($e);
          add = h3.a;
        }
        break;
      case 'h4':
        h5 = h6 = null;
        if (h2 && h3) {
          h4 = parseHeading($e);
          add = h4.a;
        }
        break;
      case 'h5':
        h6 = null;
        if (h2 && h3 && h4) {
          h5 = parseHeading($e);
          add = h5.a;
        }
        break;
      case 'h6':
        if (h2 && h3 && h4 && h5) {
          h6 = parseHeading($e);
          add = h6.a;
        }
        break;
    }
    if (add) {
      entries.push({
        id: `${fileId}-${idx++}`,
        link: file + (add ? `#${add}` : ''),
        l0: section,
        l1: h1.t,
        l2: h2 ? h2.t : null,
        l3: h3 ? h3.t : null,
        l4: h4 ? h4.t : null,
        l5: h5 ? h5.t : null,
        l6: h6 ? h6.t : null,
        d: '',
      });
    }
  });
  // console.log(entries);
  return entries;
}

function buildIndex(docs) {
  let idx = lunr(function () {
    this.ref('id');
    for (let i = 0; i < SEARCH_FIELDS.length; i++) {
      this.field(SEARCH_FIELDS[i]);
    }
    docs.forEach(function (doc) {
      this.add(doc);
    }, this);
  });
  return idx;
}

function buildPreviews(docs) {
  const result = {};
  for (let i = 0; i < docs.length; i++) {
    var doc = docs[i];
    const { l0, l1, l2, l3, l4, l5, l6 } = doc;
    const p = [l0, l1, l2, l3, l4, l5, l6].filter((l) => l !== null);
    const c = p[p.length - 1];
    if (c.length > MAX_PREVIEW_CHARS)
      c = c.slice(0, MAX_PREVIEW_CHARS) + ' ...';
    result[doc['id']] = {
      c,
      p,
      l: doc['link'],
    };
  }
  return result;
}

function main() {
  files = findHtml(HTML_FOLDER);
  const docs = [];
  console.log('Building index for these files:');
  for (let i = 0; i < files.length; i++) {
    console.log('    ' + files[i]);
    docs.push(...parseHtmlForEntries(HTML_FOLDER, files[i], i));
  }
  const idx = buildIndex(docs);
  const previews = buildPreviews(docs);
  const js =
    'export const LUNR_DATA = ' +
    JSON.stringify(idx) +
    ';\n' +
    'export const PREVIEW_LOOKUP = ' +
    JSON.stringify(previews) +
    ';';
  fs.writeFile(OUTPUT_INDEX, js, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('Index saved as ' + OUTPUT_INDEX);
  });
}

main();
