// From https://github.com/mattjcowan/vitepress/blob/with-lunr-search/docs/components/search/LunrSearch.ts

import { default as docsearch } from '@docsearch/js'
import lunr from 'lunr';
import { withBase } from 'vitepress'
import { LUNR_DATA, PREVIEW_LOOKUP } from './lunrData'

export function lunrSearch(props) {
  props.disableUserPersonalization = true;
  props.transformSearchClient = searchClient => {
    searchClient.search = (n, r) => {
      const query = (n && n.length > 0 && n[0].query) ? n[0].query : '';
      return new Promise((resolve) => {
        const response = {
          results: [
            {
              'hits': [],
              'nbHits': 0,
              'page': 0,
              'nbPages': 0,
              'hitsPerPage': 1,
              'exhaustiveNbHits': true,
              'exhaustiveTypo': true,
              'exhaustive': {
                'nbHits': true,
                'typo': true
              },
              'query': 'T',
              'params': 'query=T&attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=20',
              // 'index': 'klinecharts',
              'renderingContent': {},
              'processingTimeMS': 10,
              'processingTimingsMS': {
                'getIdx': 1,
                'total': 2
              }
            }
          ]
        };
        if (query.length > 0) {
          const idx = lunr.Index.load(LUNR_DATA);
          const searchResults = idx.search(query + '*');
          response.results[0].nbHits = searchResults.length;

          const hits = response.results[0].hits;
            for (let i = 0; i < searchResults.length; i++) {
              const id = searchResults[i]['ref'];
              const item = PREVIEW_LOOKUP[id];
              const link = `${window.location.origin}/${item['l']}`;
              const levels = item['p'];
              const hit = {
                objectID: id,
                url: withBase(link),
                content: item['c'],
                type: 'lvl' + (levels.length - 1),
                hierarchy: {
                  'lvl0': levels.length > 0 ? levels[0] : null,
                  'lvl1': levels.length > 1 ? levels[1] : null,
                  'lvl2': levels.length > 2 ? levels[2] : null,
                  'lvl3': levels.length > 3 ? levels[3] : null,
                  'lvl4': levels.length > 4 ? levels[4] : null,
                  'lvl5': levels.length > 5 ? levels[5] : null,
                  'lvl6': levels.length > 6 ? levels[6] : null,
                }
              }
              hits.push(hit);
            }
        }
        resolve(response);
      });
    }
    return searchClient;
  }
  docsearch(props);
};