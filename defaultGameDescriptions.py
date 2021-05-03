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
    for game in current_games: 
        new_game_query = f"mutation {{ updateUser(id: \"{user['id']}\", handle: \"{handle}\", name: \"{user['name']}\", email: \"{user['email']}\", elo: {user['elo']}, friend_ids: [], profile_url: \"{default_profile_url}\"){{ id }} }}"
        # requests.post(url, json={'query': new_game_query}).json()




if __name__ == '__main__':
    main()