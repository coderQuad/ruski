#!/usr/bin/env python3
'''Script for retreiving the total number of yaks and beers, then records to a json file'''

import json
import requests

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

    
    print(games)

if __name__ == '__main__':
    main()