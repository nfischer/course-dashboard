Python
======

For python files, please conform to [Google's Python style
guide](https://google-styleguide.googlecode.com/svn/trunk/pyguide.html). If
that's too long to read, please check out the summary below:

### Variable names

 - Use snake case. `my_var_name` is preferred over `myVarName`
 - Be descriptive:
    - `rv` doesn't make sense to anyone but you
    - `retval` is a bit better
    - `return_val` lets us know that you intend to return something
    - `return_node` is better still, because now we know what this represents

### Comments

 - Comment everything. I don't know what's going on inside your head. If you
   don't take ~10 seconds to comment what you're doing, I have to spend 10-20
   minutes looking up module specifications and tutorials just to figure out
   what the method calls do. Don't be "that guy"
 - Comment things like `# this is a comment` vs. `#this is a comment`. It's just
   nicer (and plays better with auto-commenting plugins such as `vim-commentary`

### Functions/Methods

 - Do comment-blocks for the whole function. I don't know what your return type is, what parameters you expect, etc. Again, don't be "that guy". I don't care if you use Java-style comments, Python doc-strings, or plain English, but please give some indication of:
    - what your function does
    - what arguments it expects (types, or at least descriptions of types, are
      cool)
    - what its return value is (again, types are cool)

### Strings

 - Single quotes over double quotes. Prefer 'hello world' over "hello world"
   Just personal taste, but we should choose one convention for readability
 - If you have a lot of newlines, consider python doc-strings, which  should be
   formatted as `"""This is a docstring"""`

### Whitespace

 - Trailing whitespace is just annoying. Don't leave a space character on the
   end of a code line
 - Don't use tabs. Use 4 spaces for indents

### Spelling

 - When applicable, check your spelling. If using vim, consider `:set spell`

Javascript
==========

Consider the [Google Javascript style guide](https://google.github.io/styleguide/javascriptguide.xml)
