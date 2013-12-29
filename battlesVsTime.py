import json
import sys

def data(iter):
    for line in iter:
        doc = json.loads(line)
        yield [doc['battles'], doc['timeInNanos']]

for line in data(sys.stdin):
    print '{0},{1}'.format(*line)
