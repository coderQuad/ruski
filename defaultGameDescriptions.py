#!/usr/bin/env python3

import json
import requests

def main():
    url = "http://server.playruski.com:4000/graphql"

    # get current users in db and all of their properties
    current_users_query = """
                            {
                                games{
                                    id
                                    location
                                    description
                                    winning_team{
                                        ...playerFields
                                    }
                                    losing_team{
                                        ...playerFields
                                    }
                                }
                            }

                            fragment playerFields on Player{
                                id
                            }
                          """
    current_games = requests.post(url, json={'query': current_users_query}).json()['data']['games']
    print(current_games)

    #loop through users, create a handle, and set default profile pic
    description = "ruski is fun"
    for game in current_games: 
        new_game_query = f"mutation {{ updateGame(id: \"{game['id']}\", location: \"fisher\", description: \"{description}\", winning_team_player_ids: [\"{game['winning_team'][0]['id']}\", \"{game['winning_team'][1]['id']}\"], losing_team_player_ids: [\"{game['losing_team'][0]['id']}\", \"{game['losing_team'][1]['id']}\"] ){{ id }} }}"
        requests.post(url, json={'query': new_game_query}).json()




if __name__ == '__main__':
    main()