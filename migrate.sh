ssh -L 5432:127.0.0.1:5432 sarp &
PID_SSH=$!
sleep 10
bunx drizzle-kit migrate
ps -ax | grep "$PID_SSH"
kill -9 $PID_SSH
echo $?