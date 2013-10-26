import os

# Use environment variables for credentials
#

MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_URI = 'mongodb://{0}:{1}@paulo.mongohq.com:10039/redjohn'.format(MONGO_USER, MONGO_PASSWORD)

TWITTER_CONSUMER_KEY = os.getenv('CONSUMER_KEY')
TWITTER_CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
TWITTER_ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')
TWITTER_ACCESS_TOKEN_SECRET = os.getenv('ACCESS_SECRET')