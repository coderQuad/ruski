#!/usr/bin/env python3

import json
import requests

def main():
    url = "http://server.playruski.com:4000/graphql"

    # get current users in db and all of their properties
    current_users_query = """
                            {
                                users{
                                    handle
                                    id
                                    name
                                    email
                                    elo
                                    friends{
                                        id
                                    }
                                    profile_url
                                }
                            }
                          """
    current_users = requests.post(url, json={'query': current_users_query}).json()['data']['users']

    #loop through users, create a handle, and set default profile pic
    for user in current_users: 
        name = user['name'].split()
        handle = ''.join(name).lower()
        default_profile_url = "https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg"
        new_user_query = f"mutation {{ updateUser(id: \"{user['id']}\", handle: \"{handle}\", name: \"{user['name']}\", email: \"{user['email']}\", elo: {user['elo']}, friend_ids: [], profile_url: \"{default_profile_url}\"){{ id }} }}"
        requests.post(url, json={'query': new_user_query}).json()




if __name__ == '__main__':
    main()