#!/usr/bin/env python
# coding: utf-8

# In[184]:


import csv
import pandas as pd
import numpy as np
import datetime as dt
import math
import json


# In[2]:


DATA_FILE = 'data/data.csv'


# In[31]:



LOCALITY_MAP = {
    'Mercy Medical Center, Springfield Ma': 'Springfield',
    'South Lawrence East School': 'Lawrence',
    'Northampton Senior Center': 'Northampton',
    'West Of The River Collaborative': 'West Springfield',
    'Saint Vincent Hospital Vaccine Collaborative @ Worcester State University - Wellness Center': 'Worcester',
    'Pediatric Assoc Of Greater Salem- Beverly': 'Beverly',
    'Amesbury High School': 'Amesbury',
    'Lowell General Hospital': 'Lowell',
    'Rutland State Hospital ': 'Rutland'
}

def get_locality(row):
    if pd.isna(row['locality']) and row['site'] in LOCALITY_MAP.keys(): return LOCALITY_MAP[row['site']]
    return row['locality']


# In[171]:


def time_bucket(date):
    time = date.time()
    return (time.hour*60 + time.minute)*60 + time.second

def get_data():
    data = pd.read_csv(DATA_FILE)
    data['locality'] = data.apply(get_locality, axis=1)
    data['date'] = pd.to_datetime(data['date'])
    data['posted'] = pd.to_datetime(data['posted'])
    data['posted_time'] = data['posted'].apply(time_bucket)
    return data


# In[177]:


def get_last_n_days(data, n):
    n_days_ago = dt.datetime.now() - dt.timedelta(days=n)
    return data[data['posted'] > n_days_ago]


# In[210]:


def get_histogram(data):
    count, _ = np.histogram(data['posted_time'], bins=range(0, 60*60*24, 60*10))
    return list(map(lambda x: int(x), count))

def get_map(data):
    return [{'locality': locality, 'count': len(records)} for locality, records in data.groupby('locality')]


# In[211]:


def get_histograms(data):
    oldest = min(data['posted'])
    weeks = math.ceil(((dt.datetime.now() - oldest).days + 1) / 7)
    days = 6
    result = {}
    for day in range(1, days+1):
        result['last_{}_days'.format(day)] = get_histogram(get_last_n_days(data, day))
    for week in range(1, weeks+1):
        result['last_{}_weeks'.format(week)] = get_histogram(get_last_n_days(data, week*7))
    return result

def get_maps(data):
    oldest = min(data['posted'])
    weeks = math.ceil(((dt.datetime.now() - oldest).days + 1) / 7)
    days = 6
    result = {}
    for day in range(1, days+1):
        result['last_{}_days'.format(day)] = get_map(get_last_n_days(data, day))
    for week in range(1, weeks+1):
        result['last_{}_weeks'.format(week)] = get_map(get_last_n_days(data, week*7))
    return result

def get_analysis(data):
    return {
        'histograms': get_histograms(data),
        'map': get_maps(data)
    }


# In[214]:


def generate_analysis():
    data = get_data()
    with open('data/analysis.json', 'w') as fopen:
        print(get_analysis(data))
        fopen.write(json.dumps(get_analysis(data)))


# In[215]:


if __name__ == '__main__': generate_analysis()


# In[ ]:
