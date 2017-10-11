import Hash from '../Hash';

export function buildUrl(options: { url?: string, queryParams?: string | Hash<any> }, defaultUrl: string = ''): string {
    let url = options.url || defaultUrl;

    if (options.queryParams) {
        url += '?' + buildEncodedQueryParams(options.queryParams);
    }

    return url;
}

export function buildEncodedQueryParams(queryParams: string | Hash<any>) {
    if (typeof queryParams === 'string') {
        return queryParams;
    }

    return Object.keys(queryParams)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
}

export function trailUrl(url: string): string {
    return url.endsWith('/') ? url : (url + '/');
}