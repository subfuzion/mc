# mc

`mc` runs a program or a suite of programs and reports exit codes. It's
primarily intended for automation in a CI environment, but it also provides a
CLI for interactive test runs.

A run specification (`mc.spec.yaml`) includes steps that should be familiar to
anyone who has written a build config file for Cloud Build or workflows for
GitHub Actions. The spec wil include support for invoking `cloudbuild.yaml`.

Cloud Build can be activated by a repo hook to build an image includes lifecycle
steps which support setup and teardown steps before launching a target
program(s), and then deployed to Cloud Run.

By default, run specification steps are launched in sequence to ensure
predictable behavior (for examples, programs that make modifications to storage
or databases shouldn't conflict with other programs launched as part of a
suite). Support is intended for launching non-overlapping programs and suites
later.

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

   - Linux / macOS

     ```text
     curl -fsSL https://deno.land/install.sh | sh
     ```

   - Others: https://docs.deno.com/runtime/fundamentals/installation/

2. Initialize

   ```text
   deno install
   ```

3. Try `mc`

   ```text
   deno -A mc.ts
   ```

4. Test `mc`

   ```text
   deno test
   ```

5. Compile `mc`

   ```text
   deno compile -A mc.ts
   ```

   Run the executable:

   ```text
   ./mc
   ```

   ```text
   PATH="./:$PATH"
   mc
   ```

6. Before pushing changes

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

   ## Use tasks

   Deno tasks are similiar to npm run scripts. Two tasks are defined in
   `deno.json`:

   - `check` - run checks for format, lint, and types
   - `fix` - format files and attempt to fix lint issues

   For example, to run `check`, enter:

   ```
   deno task check
   ```
