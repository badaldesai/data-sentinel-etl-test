import { transformData } from '../src/transform';

describe('transformData', () => {
  it('should transform the data into proper format', () => {
    const rawData = {
      ts: 1234567890,
      u: "https://www.test.com/products/productA.html?a=5435&b=test#reviews",
      e: [ { e: 'touch' } ]
    };
    const returnData = [{
      timestamp: 1234567890,
      url_object: {
        domain: 'www.test.com',
        path: '/products/productA.html',
        query_object: {
          a: '5435',
          b: 'test'
        },
        hash: '#reviews',
      },
      ec: { e: 'touch'}
    }]
    expect(transformData(JSON.stringify(rawData))).toEqual(returnData);
  });

  it('should transform the data into format without hash', () => {
    const rawData = {
      ts: 1234567890,
      u: "https://www.test.com/products/productA.html?a=5435&b=test",
      e: [ { e: 'touch' } ]
    };
    const returnData = [{
      timestamp: 1234567890,
      url_object: {
        domain: 'www.test.com',
        path: '/products/productA.html',
        query_object: {
          a: '5435',
          b: 'test'
        },
        hash: '',
      },
      ec: { e: 'touch'}
    }]
    expect(transformData(JSON.stringify(rawData))).toEqual(returnData);
  });

  it('should transform the data into format empty query object', () => {
    const rawData = {
      ts: 1234567890,
      u: "https://www.test.com/products/productA.html#reviews",
      e: [ { e: 'touch' } ]
    };
    const returnData = [{
      timestamp: 1234567890,
      url_object: {
        domain: 'www.test.com',
        path: '/products/productA.html',
        query_object: {},
        hash: '#reviews',
      },
      ec: { e: 'touch'}
    }]
    expect(transformData(JSON.stringify(rawData))).toEqual(returnData);
  });

  it('should transform the data into format with array of events', () => {
    const rawData = {
      ts: 1234567890,
      u: "https://www.test.com/products/productA.html#reviews",
      e: [ { e: 'touch' }, { e: 'click'} ]
    };
    const returnData = [{
      timestamp: 1234567890,
      url_object: {
        domain: 'www.test.com',
        path: '/products/productA.html',
        query_object: {},
        hash: '#reviews',
      },
      ec: { e: 'touch'}
    }, {
      timestamp: 1234567890,
      url_object: {
        domain: 'www.test.com',
        path: '/products/productA.html',
        query_object: {},
        hash: '#reviews',
      },
      ec: { e: 'click'}
    }]
    expect(transformData(JSON.stringify(rawData))).toEqual(returnData);
  });
});