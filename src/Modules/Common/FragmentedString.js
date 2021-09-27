import {isValidElement} from 'react';

const FragmentedString = ({string, params, matchPattern, raw}) => {
  const render = (entries) => entries.map(({type, content}, idx) => type !== 'react'
    ?ReactHtmlParser(content)
    :<span key={idx}>{content}</span>
  );

  const transformer = (str, params) => {
    const matches = str.matchAll(matchPattern);
    const segments = [];
    let offset=0;
    for (const match of matches) {
      segments.push({
        type: 'html',
        content: str.substr(offset, match.index-offset)
      })
      segments.push({
        type: isValidElement(params[match[1]])?'react':'html',
        content: params[match[1]]
      })
      offset = match.index + match[0].length;
    }

    offset<str.length && segments.push({
      type: 'html',
      content: str.substr(offset)
    });

    return segments;
  }
  if(raw) return transformer(string, params);
  const Output = () => render(transformer(string, params));
  return <Output />
};

FragmentedString.defaultProps = {
  raw: false,
  //matchPattern: /{{\s?([^{}\s]*)\s?}}/g;
  matchPattern: /\$\{(\w+)\}/g
}

export default FragmentedString;
