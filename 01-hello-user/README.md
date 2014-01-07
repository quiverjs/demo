
Quiver.js Demo 1: Hello User
============================

This demo demonstrates the way to write a set of quiver components to serve different users in different ways. 

## Tutorial

The main tutorial for this demo can be found at the [tutorial](tutorial) folder.

## Reference

The main handler accepts a user ID argument and read from input stream. It the greet the user's name and output the stream content. Depending on the user's attribute, the handler handles users differently: 

  - For normal user the input stream content is HTML-escaped, while for admin users with `is_admin` attribute the raw stream is accepted. 
  - User with `want_uppercase_greet` attribute will receive output in all uppercase.
  - User with `is_banned` attribute are rejected from greeting.
  - User with custom `greet` attribute are greeted with the custom word instead of the default greet word.

The config.json can be used to configure some behavior of the main handler. Changing `defaultGreet` will cause the handler to by default greet users with the specified word instead of "hello". The `mockUserEntries` can be used to modify the mock user database, whch in this case is implemented simply as a simple JSON array.


## Run as Command Line

This demo can be run from the command line using [quiver-command](https://github.com/quiverjs/command), a tool to wrap quiver components into command line application. With `quiver-command` installed globally using npm, the demo can be run as follow:

```bash
$ quiver-command . --config config.json --user_id john
```

The user_id john can be replaced with any user in the mock user entries specified in the config. Since the command accepts input from STDIN, the user may type in anything and then press `Ctrl+D` to finishe the input.

Alternatively a simple shell script is provided to run the demo simply as

```bash
$ bin/command.sh john
```

### Example Output

Here are some examples of the expected output, with the program's STDIN fed from echo:

```bash
$ echo "<b>hello world</b>" | bin/command.sh john
bonjour, <b>John Smith</b>!
You have submitted the following text: &lt;b&gt;hello world&lt;/b&gt;

$ echo "<b>hello world</b>" | bin/command.sh admin
hello, <b>Administrator</b>!
You have submitted the following text: <b>hello world</b>

$ echo "hello world" | bin/command.sh joker
HELLO, <B>MR JOKER</B>!
YOU HAVE SUBMITTED THE FOLLOWING TEXT: HELLO WORLD

$ bin/command.sh nobody
Error: user not found

$ bin/command.sh troll
Error: you are banned!
```

## Run as Server

This demo can also be run as a HTTP server using [quiver-server](https://github.com/quiverjs/server), a tool for wrapping quiver components into http server. With `quiver-server` installed globally using npm, the demo can be run as follow:

```bash
$ quiver-server . --config config.json
```

Alternatively a simple shell script is provided to run the demo simply as

```bash
$ ./server.sh
```

By default the server listen at port 8080. The user id is extracted from the HTTP GET path, and the content is submitted through HTTP POST.

### Example Output
The server can be tested easily using `curl`:

```bash
$ curl http://localhost:8080/john --data "<b>hello world</b>"
bonjour, <b>John Smith</b>!
You have submitted the following text: &lt;b&gt;hello world&lt;/b&gt;

$ curl http://localhost:8080/admin --data "<b>hello world</b>"
hello, <b>Administrator</b>!
You have submitted the following text: <b>hello world</b>

$ curl http://localhost:8080/joker --data "hello world"
HELLO, <B>MR JOKER</B>!
YOU HAVE SUBMITTED THE FOLLOWING TEXT: HELLO WORLD

$ curl -v http://localhost:8080/nobody
> GET /troll HTTP/1.1
> 
< HTTP/1.1 404 Not Found

$ curl -v http://localhost:8080/troll
> GET /troll HTTP/1.1
> 
< HTTP/1.1 403 Forbidden
```