from pymongo import DESCENDING
from pymongo import MongoClient
from settings import MONGO_URI
from datetime import datetime

# Open a connection to Mongo once
#
mongo_client = MongoClient(MONGO_URI)

red_john_tweets = mongo_client.redjohn.tweets

suspects = [
    'partridge', 'kirkland', 'bertram', 'stiles', 'haffner',
    'mcallister', 'smith'
]

def get_suspect_mentions():
    suspect_mentions = {}
    for suspect in suspects:
        mentions = red_john_tweets.find({
            'suspect': suspect 
        }).count()
        suspect_mentions[suspect] = {
            'count': mentions,
            'most_recent_tweets': get_recent_tweets(suspect)
        }

    return suspect_mentions

def get_tweet_count():
    return red_john_tweets.count()

def get_recent_tweets(suspect, limit=3):
    tweets = []

    raw_tweets = red_john_tweets.find({
        'suspect': suspect
    }).sort('entry_time', DESCENDING)[:limit]

    for tweet in raw_tweets:
        tweets.append({
            'text': tweet['text'],
            'user': tweet['user'],
            'created_at': tweet['created_at']
        })

    return tweets

def get_tweet_time_series():
    all_tweets = red_john_tweets.find()

    tweet_time_series = {}

    for tweet in all_tweets:
        created_at = tweet['created_at'].strftime('%Y-%m-%d')
        if created_at in tweet_time_series:
            tweet_time_series[created_at] = tweet_time_series[created_at] + 1
        else:
            tweet_time_series[created_at] = 1

    time_series = []

    for date, count in tweet_time_series.iteritems():
        time_series.append({
            'date': date,
            'count': count
        })

    time_series = sorted(time_series, key=lambda k: datetime.strptime(k['date'], '%Y-%m-%d'))

    return time_series
