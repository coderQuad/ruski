# Ruski
> The Game of Games  

<p align="center">
<img height=300 width=360 src="https://d26n5v24zcmg6e.cloudfront.net/Ruski_Logo.jpeg">
</p>

## Deployments
##### dev.playruski.com (deploys from dev branch)
[![Netlify Status](https://api.netlify.com/api/v1/badges/b38d1203-5ac3-4507-b501-62164c868824/deploy-status)](https://app.netlify.com/sites/peaceful-tereshkova-8310b6/deploys)
##### playruski.com (deploys from prod branch)
[![Netlify Status](https://api.netlify.com/api/v1/badges/bc70db97-2a99-4dd2-b7b1-87498627490b/deploy-status)](https://app.netlify.com/sites/infallible-shannon-0c6d08/deploys)

## Contributing
All pull requests must be branched off of and then requested to merge into the [dev](https://github.com/danerwilliams/ruski/tree/dev) branch. We will periodically merge the dev branch into the main prod branch as releases. 

## Configurations
### Environment Variables
Environment variables must either be set or included in .env file inside of the backend folder.
##### Backend
AWS access keys for S3 uploading:
Be sure to use `sudo -E` when running node on port 80 to pass environment variables to the root user. 
`ACCESS_KEY_ID=******************`
`SECRET_ACCESS_KEY=****************************`

## Server deployment
setup nginx + let's encrypt ssl + pm2 to auto renew certificates without disrupting server.  
https://www.learnwithjason.dev/blog/deploy-nodejs-ssl-digitalocean  
Then start server  
`pm2 start 'node server.js -p 5000'`  
Edit the file to add a post hook so that nginx restarts when certificate is renewed  
`sudo vi /etc/letsencrypt/renewal/server.playruski.com.conf`
and add  
`post_hook = /bin/systemctl reload nginx`  
somewhere below  
`[renewalparams]`




### Cron
Run `crontab -e` to edit your crontab and add the following line:  
`11 23 * * * ~/ruski/backend/cronjob-script.py 1> ~/ruski/backend/yack-beer-totals.json`

### S3
##### Bucket policy
```
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::***********:user/username"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::myBucket/*"
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::myBucket/*"
        }
    ]
}
```

##### CORS policy
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```
