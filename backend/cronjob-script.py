#!/usr/bin/env python3
'''Script for retreiving the total number of yaks and beers, then records to a json file'''

import requests
import json
from functools import reduce

def sum_yaks(a, b):
    '''function to reduce yaks to their sum'''
    total = b['winning_team'][0]['penalties'] + b['losing_team'][0]['penalties'] + b['winning_team'][1]['penalties'] + b['losing_team'][1]['penalties']
    return a + total

def main():
    '''main driver'''
    url = 'http://localhost:4000/graphql'

    query = """
            {
                games{
                    winning_team{
                        ...playerFields
                    }
                    losing_team{
                        ...playerFields
                    }
                }
            }

            fragment playerFields on Player{
                penalties
            }
            """

    games = requests.post(url, json={'query': query}).json()['data']['games']
    yaks = reduce(sum_yaks, games, 0)
    beers = 30 * len(games) #30 beers per game

    result = {}
    result['yacks'] = yaks
    result['beers'] = beers

    print(json.dumps(result))


if __name__ == '__main__':
    main()
