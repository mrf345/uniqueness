# uniqueness (Beta)
### [jQuery][fd4a5c2f] based script to help monitor, show and hide multiple one-page elements at once

  [fd4a5c2f]: https://jquery.com "jQuery website"

## [Live Demo][233c5b6b]

  [233c5b6b]: https://audio-sequence.github.io/uniqueness.html "Live demo"

![Demo GIF](http://audio-sequence.github.io/uniqueness.gif)

## Setup :

```html
<head>
  <script src='uniqueness.js' type='text/javascript'></script>
  <script type='text/javascript'>
  $(document).ready(function() {
    var monitor = uniqueness({
      identifier: '.uniqueness',
      effect: 'fade',
      effect_duration: 1
    })
  })
  </script>
</head>
<body>
  <h1 class='uniqueness'>First</h1>
  <h1 class='uniqueness'>Second</h1>
  <h1 class='uniqueness'>Third</h1>
</body>
```

## Options :
```javascript
this.options = {
  // options to be passed by you, and its default replacement
  identifier: options.identifier || '.uniqueness', // class or id to identify elements by
  start_with: options.start_with || 0, // element index number to start from
  use_effects: options.use_effects || 'true', // to use transitional jquery UI effects
  effect: options.effect || choice(effects), // to get or set a random effect
  effect_duration: options.effect_duration * 1000 || randint(3), // effect duration in seconds. default random
  local_url: options.local_url || 'false' // to goto() via parsing index varible from url
}
```

## How to:
Typically the script will start by hiding all elements except the first one. To change that we can use the option start_with and give it the index number that we want it to start from instead. An other option is to use local_url option which will allow you start from the index number passed to the url with hash tag and 'unique' like such: `http://localhost/#unique2`. 2 is the index we want to start with. And don't forget to pass local_url: 'true' in options, for this to work.

## Useful functions :
To use any of the following functions, you have to get an instance of the constructor, which we did in the Setup section : </br>
` var monitor = uniqueness()` </br>
` monitor.following_functions()`

##### - Monitor elements:

```javascript
this.goto = function goto (index) {
  // to validate the index value and toggle it
}

this.next = function next () {
  // to toggle the next element in selection
}

this.back = function back () {
  // to toggle the previous element in selection
}
```
##### - Listing and status :

```javascript
this.list = function (param) {
  // logging selected elements with their index number or returning object of them
}

this.current = function () {
  // returning he currently displayed element index
}

this.length = function () {
  // returning the number of existing elements
}

```

## List of jQuery UI effects :

```javascript
var effects = [
  // jquery ui effects
  'blind', 'bounce', 'clip',
  'drop', 'explode', 'fade',
  'fold', 'highlight', 'puff',
  'pulsate', 'scale', 'shake',
  'size', 'slide']
```

## Dependencies:
1. jQuery
2. jQuery UI (optional)
