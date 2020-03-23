# vanillish

[<img src="vanillish.svg?sanitize=true" height=250>]()

### What is it?
<details>
  <summary>
    <strong>tl;dr:</strong> easy-to-use in-browser CRUD db
  </summary>
  <br />

  A brand new package project! It's a CRUD wrapper around [`@brightsole/vanillite`](https://github.com/one19/vanillite).
  
  It has a number of methods that make setting, getting, querying, and deleting data a dream!

  It's ready for you to add some functionality, and publish it!

</details>
<br/>

### How to use it?
<details>
  <summary>
    <strong>tl;dr:</strong> <code>npm i vanillish</code>
  </summary>
  <br />

  

  | methodName | args | return |
  |--- | --- |--- |
  | setItem | StorageItem | Promise(StorageItemWithId) |
  | getItem | id | Promise(StorageItemWithId) |
  | getAll | `none` | Promse([StorageItemWithId]) |
  | deleteItem | id | Promise(`none`) |
  | deleteAll | `none` | Promise(`none`) |
  | query | QueryObject | Promise([StorageItemWithId]) |

</details>
<br/>

### TODO:
<details>
  <summary>
    <strong>tl;dr:</strong> alot; but it's functional
  </summary>
<br />

#### High priority
1. type the query object
1. test it
    1. create
    1. read
    1. update
    1. delete
    1. very thoroughly test querying, especially deep comparisons like `'dingle.bloop.floobo': ['niner']`
1. UNBREAK THE STORAGE LIB - we stopped allowing a variable storage lib to screw down the types and get the dep working. I'd like that unbroken so that you could instantiate it with `localforage` to remove the caching, or `vanillite` to optimise speed with an in-memory cache

#### Low priority

1. refactor methods to only be CRUD, no named `createAll`, just look at inputs for _what to do_
1. allow for querying using regex queryParam properties :sparkles:

</details>
<br/>
<a href="https://www.buymeacoffee.com/Ao9uzMG" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>