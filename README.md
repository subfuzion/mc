# mc

`mc` runs a program or a suite of programs and reports exit codes. It's
primarily intended for automation in a CI environment, but it also provides a
CLI for interactive test runs.

```
mc 1.0.0 - run a suite of programs and report their exit codes

USAGE:
  mc [OPTIONS] [PATHNAME]

  PATHNAME           path to a program or directory ('.')

OPTIONS:
  -h, --help         print usage information
  -l, --loglevel     increase output: silent | error | warn | info * | log | debug
  -v, --version      print current version
```

## Developer Notes

1. Install Deno

   * Linux / macOS

      ```text
      curl -fsSL https://deno.land/install.sh | sh
      ```

   * Others: https://docs.deno.com/runtime/fundamentals/installation/

2. Initialize

   ```text
   deno install
   ```

3. Try `mc`

   ```text
   ./mc
   ```
   
   or

   ```text
   PATH=".:$PATH"
   mc
   ```
   
4. Test `mc`

   ```text
   deno test
   ```

5. Before pushing changes

   Both Visual Studio Code and Webstorm provide Deno support. There is also
   support for other editors. Even with integrated Deno support, you might want
   to perform the following steps manually before pushing your commits.

   ```text
   # Ensure code is formatted
   deno fmt
   
   # Ensure types are checked
   deno check
   
   # Additional lint checks
   deno lint
   ```

   Without integrated Deno support in your editing environment, consider running
   watches (in separate terminals):

   ```text
   # Ensure types are checked
   deno check --watch
   
   # Additional lint checks
   deno lint --watch
   ```
