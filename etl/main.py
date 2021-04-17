#!/usr/bin/env python
# coding: utf-8

# In[240]:


import requests
import pandas as pd
import re
import json
import csv
import os
from datetime import datetime as dt

FATAL = 'FATAL'; ERROR = 'ERROR'; WARN = 'WARN'; INFO = 'INFO'; DEBUG = 'DEBUG'; TRACE = 'TRACE'

def log(message, level='INFO'):
    print('[{}] {} | {}'.format(level, dt.now(), message))

# In[241]:


# adapted from
# https://raw.githubusercontent.com/twitterdev/Twitter-API-v2-sample-code/master/Recent-Search/recent_search.py

def auth(): return os.getenv('BEARER_TOKEN')

def create_url(query, next_token=None, tweet_fields=None):
    # Tweet fields are adjustable.
    # Options include:
    # attachments, author_id, context_annotations,
    # conversation_id, created_at, entities, geo, id,
    # in_reply_to_user_id, lang, non_public_metrics, organic_metrics,
    # possibly_sensitive, promoted_metrics, public_metrics, referenced_tweets,
    # source, text, and withheld
    
    next_token = ('next_token=' + next_token) if next_token is not None else ''
    tweet_fields = tweet_fields if tweet_fields is not None else ''
    
    url = 'https://api.twitter.com/2/tweets/search/recent?query={}&{}&{}'.format(query, tweet_fields, next_token)
    return url


def create_headers(bearer_token):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    return headers


def connect_to_endpoint(url, headers):
    response = requests.request("GET", url, headers=headers)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return response.json()


def get_tweets(account, next_token=None):
    bearer_token = auth()
    url = create_url('from:' + account, next_token, tweet_fields='tweet.fields=created_at')
    log('making request to endpoint')
    headers = create_headers(bearer_token)
    json_response = connect_to_endpoint(url, headers)
    return json_response


# In[242]:


OPTION_A = r'([0-9]*) appointments available at (.*?)( in (.*?), MA)? on ([0-9]{4}[-][0-9]{2}[-][0-9]{2}|[0-9]{1,2}/[0-9]{1,2}/[0-9]{4})( for (.*?))?\. Check eligibility and sign up at (.*?)$'
OPTION_B = r'(.*?) appointments available in (.*?)\. Check eligibility and sign up at (.*?)$'

COMP_A = re.compile(OPTION_A)
COMP_B = re.compile(OPTION_B)


# In[243]:


def to_upper(phrase):
    return ' '.join(map(lambda x: x.capitalize(), phrase.split(' ')))

def extract_details_a(entry):
    match_a = COMP_A.match(entry['text'])
    if match_a is None: return None
    
    (count, site, _, locality, date, _, vaccine_type, website) = match_a.groups()
    
    try: date = dt.strptime(date, '%Y-%m-%d')
    except:
        try: date = dt.strptime(date, '%m/%d/%Y')
        except: date = None

    row = pd.DataFrame([{
        'id': entry['id'],
        'count': int(count),
        'site': to_upper(site),
        'locality': to_upper(locality) if locality is not None else None,
        'date': date,
        'vaccine_type': to_upper(vaccine_type) if vaccine_type is not None else None,
        'posted': dt.strptime(entry['created_at'], '%Y-%m-%dT%H:%M:%S.%fZ'),
        'website': website.lower()
    }])
    return row

def extract_details_b(entry):
    match_b = COMP_B.match(entry['text'])
    if match_b is None: return None
    (site, localities, website) = match_b.groups()
    date = dt.strptime(entry['created_at'], '%Y-%m-%dT%H:%M:%S.%fZ')
    
    rows = pd.DataFrame([{
        'id': entry['id'],
        'count': None,
        'site': '{} - {}'.format(to_upper(site), to_upper(locality.strip())),
        'locality': to_upper(locality.strip()),
        'date': date,
        'vaccine_type': None,
        'posted': date,
        'website': website.lower()
    } for locality in localities.split(',')])
    return rows


# In[244]:


def get_data(stop_id=None):
    log('getting data; stop_id: {}'.format(stop_id))
    data = []
    ids = set()
    next_token = None
    isFirstRun = True
    newest_id = None

    while isFirstRun or (stop_id not in ids and next_token is not None):
        response = get_tweets('vaccinetime', next_token)
        if isFirstRun: newest_id = response['meta']['newest_id']
        data += response['data']
        ids = set(map(lambda x: x['id'], response['data']))
        try: next_token = response['meta']['next_token']
        except: next_token = None
        isFirstRun = False
            
    if stop_id is not None:
        stop_id_index = (
            len(data) -
            next(i for i, v in enumerate(reversed(data), 1) if v['id'] == stop_id)
        )
        data = data[:stop_id_index]
    return (data, newest_id)


# In[245]:


CACHE_FILE = 'data/data.csv'
METADATA_FILE = 'data/metadata.json'

def fetch_new_data():
    latest_id = None
    try:
        with open(METADATA_FILE) as fopen:
            metadata = json.loads(fopen.read())
            latest_id = metadata['latest_id']
        log('latest_id: {}'.format(latest_id))
    except:
        log('unable to open metadata file and get latest_id', WARN)
    return get_data(latest_id)

def cache_data(df, newest_id):
    try:
        df.to_csv(CACHE_FILE, mode='a', header=False, index=False)
        with open(METADATA_FILE, 'w') as fopen:
            fopen.write(json.dumps({ 'last_updated': dt.now().isoformat(), 'latest_id': newest_id }))
    except:
        log('unable to write to cache file or to metadata file', ERROR)
    


# In[246]:


def data_to_frame(data):
    rows = []
    for entry in data:
        try:
            details = extract_details_a(entry)
            if details is None: details = extract_details_b(entry)
            if details is not None: rows.append(details)
            else: log('no match for `{}`'.format(entry['text']), WARN)
        except: log('matching failed for `{}`'.format(entry['text']), WARN)
    return pd.concat(rows) if len(rows) > 0 else None


# In[247]:


def pull_data():
    log('pulling data...')
    (data, newest_id) = fetch_new_data()
    df = data_to_frame(data)
    if df is None:
        log('no new data')
        return
    else: log('{} new records'.format(len(df)))
    cache_data(df, newest_id)
    


# In[249]:


if __name__ == "__main__":
    pull_data()


# In[ ]:
