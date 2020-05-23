# Steps to start the Backend:
1. ```docker start postgres```
2. ```traefik.exe```
3. ```yarn watch```
4. ```yarn serve```


# General Information

## For DB Schema/Model changes run
1. Generate a migration  
```yarn run prisma migrate save --experimental```
2. Execute the migration   
```yarn run prisma migrate up --experimental```
3. For code suggestions and better model lookup run  
```yarn run prisma generate```


## Docker overview
- shows all running containers  
```docker ps```  

- shows all containers (also inactive ones)  
```docker ps -a```

- shows all images  
```docker images```

- starting instructions  
```docker start *container name*```  
```docker run *image name*```   

## Traefik
Always run traefik in order to use [api.]dashboard.zara with:  
```traefik.exe```  
(port 80 needs to be available)


# Error Lookup

