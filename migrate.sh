ssh -L 5432:127.0.0.1:5432 sarp &
PID_SSH=$!
bunx drizzle-kit migrate
ps -ax | grep "$PID_SSH"
kill -KILL $PID_SSH
echo $?