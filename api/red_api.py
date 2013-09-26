import os
from pymongo import MongoClient

MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_URI = 'mongodb://{0}:{1}@paulo.mongohq.com:10039/redjohn'.format(MONGO_USER, MONGO_PASSWORD)

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
        suspect_mentions[suspect] = mentions

    return suspect_mentions