mkdir logs
CURRENTDATE=`date +"%Y-%m-%d %H-%M-%S %z"`
node index.js -webServer 2>&1 | tee -a "./logs/${CURRENTDATE}.txt" #DEFAULT SYSTEM
#pm2 start index.js --name webServer --output "./logs/${CURRENTDATE}.txt" --error "./logs/${CURRENTDATE}.txt"
# Check CRLF LF setting